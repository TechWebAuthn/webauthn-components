export class WebSocketConnection {
  constructor(endpoint = "", secure = true) {
    this.ws = new WebSocket(`${secure ? "wss" : "ws"}://${window.location.host}${endpoint}`);
    this.ws.addEventListener("open", this._onOpen.bind(this));
    this.queue = [];
    return this;
  }

  send(data) {
    switch (this.ws.readyState) {
      case 0:
        this.queue.push(data);
        break;
      case 1:
        this.ws.send(JSON.stringify(data));
        break;
    }
  }

  listen(eventName, callback) {
    this.ws.addEventListener(eventName, (event) => {
      try {
        callback(event, JSON.parse(event.data));
      } catch (error) {
        callback(event, null);
      }
    });
  }

  _onOpen() {
    while (this.queue.length > 0) {
      this.send(this.queue.shift());
    }
  }

  close() {
    this.ws.close();
  }
}

export class WebRTCConnection {
  constructor(
    signaling,
    options = {
      iceServers: [{ urls: "stun:stun.services.mozilla.com" }],
    }
  ) {
    this.signaling = signaling;
    this.listenForSignalingEvents();
    this.peerConnection = new RTCPeerConnection(options);
    this.listenForICECandidates();

    this.dataQueue = [];

    return this;
  }

  createDataChannel(channelName = "dataChannel", options = { reliable: true, ordered: true }) {
    if (!this.dataChannel) {
      this.dataChannel = this.peerConnection.createDataChannel(channelName, options);
      this._attachDataEventListeners();
    }
  }

  sendData(data) {
    if (!this.dataChannel) {
      this.createDataChannel();
    }

    if (this.dataChannel.readyState === "open") {
      this.dataChannel.send(data);
    } else {
      this.dataQueue.push(data);
    }
  }

  listenForICECandidates() {
    this.peerConnection.addEventListener("icecandidate", this._onIceCandidate.bind(this));
  }

  listenForSignalingEvents() {
    this.signaling.listen("message", (_event, jsonMsg) => {
      if (jsonMsg?.code) {
        return this.oncode?.(jsonMsg?.code);
      }

      if (jsonMsg?.user) {
        this.onuser?.(jsonMsg?.user);
      }

      if (jsonMsg?.event === "offer") {
        return this.createAnswer(jsonMsg?.data);
      }

      if (jsonMsg?.event === "answer") {
        return this._onAnswer(jsonMsg?.data);
      }

      if (jsonMsg?.event === "candidate") {
        return this._onReceiveIceCandidate(jsonMsg?.data);
      }
    });
  }

  listenForData() {
    this.peerConnection.addEventListener("datachannel", (event) => {
      const { channel } = event;
      if (!this.dataChannel) this.dataChannel = channel;
      this._attachDataEventListeners();
    });
  }

  async createOffer() {
    try {
      const offer = await this.peerConnection.createOffer();
      this.signaling.send({
        event: "offer",
        data: offer,
      });
      this.peerConnection.setLocalDescription(offer);
    } catch (error) {
      console.info("RTC Offer", error);
    }
  }

  async createAnswer(offer) {
    try {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await this.peerConnection.createAnswer();
      this.peerConnection.setLocalDescription(answer);

      this.signaling.send({
        event: "answer",
        data: answer,
      });
    } catch (error) {
      console.info("RTC Answer", error);
    }
  }

  close() {
    this.signaling.close();
    this.peerConnection.close();
  }

  _onIceCandidate(event) {
    if (event.candidate) {
      this.signaling.send({
        event: "candidate",
        data: event.candidate,
      });
    } else {
      console.info("All candidates registered");
    }
  }

  _onAnswer(answer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  _onReceiveIceCandidate(candidate) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  _onDataChannelOpen() {
    while (this.dataQueue.length) {
      this.sendData(this.dataQueue.shift());
    }
  }

  _attachDataEventListeners() {
    this.dataChannel.onopen = (event) => {
      this._onDataChannelOpen();
      this.ondatachannelopen?.(event);
    };
    this.dataChannel.onmessage = (event) => {
      this.ondatachannelmessage?.(event);
    };
  }
}

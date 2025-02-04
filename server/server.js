const io = require("socket.io")(3002, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let peers = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register", ({ userId, role }) => {
    peers[socket.id] = { userId, role, location: null, available: false };
    console.log(`Registered ${role}:`, userId);

    if (role === "user") {
      io.emit(
        "peer-list",
        Object.values(peers).filter((peer) => peer.role === "technician")
      );
    }
  });

  socket.on("send-location", (location) => {
    if (peers[socket.id]) {
      peers[socket.id].location = location;

      Object.keys(peers).forEach((peerSocketId) => {
        if (peers[peerSocketId].role === "user") {
          io.to(peerSocketId).emit(
            "peer-list",
            Object.values(peers).filter((peer) => peer.role === "technician")
          );
        }
      });
    }
  });

  socket.on("hire", ({ technicianId, clientId }) => {
    const technicianSocket = Object.keys(peers).find(
      (id) => peers[id].userId === technicianId
    );

    if (technicianSocket) {
      const clientSocket = Object.keys(peers).find(
        (id) => peers[id].userId === clientId
      );

      const clientLocation = peers[clientSocket]?.location;

      if (clientLocation) {
        io.to(technicianSocket).emit("hire-request", {
          clientId,
          location: clientLocation,
        });

        console.log(
          `User ${clientId} wants to hire Technician ${technicianId}`
        );
      } else {
        console.log(`Client ${clientId} location is not available`);
      }
    } else {
      console.log(`Technician ${technicianId} is not available`);
    }
  });

  socket.on("hire-response", ({ response, clientId, technicianId }) => {
    const clientSocket = Object.keys(peers).find(
      (id) => peers[id].userId === clientId
    );
    const technicianSocket = Object.keys(peers).find(
      (id) => peers[id].userId === technicianId
    );

    if (response === "accept") {
      if (peers[technicianSocket]) {
        peers[technicianSocket].available = false;
      }

      io.to(clientSocket).emit("hire-accepted", {
        technicianId,
      });

      io.to(technicianSocket).emit("on-job", { clientId });

      io.to(technicianSocket).emit(
        "peer-list",
        Object.values(peers).filter((peer) => peer.userId === clientId)
      );

      const clientLocation = peers[clientSocket]?.location;
      console.log(
        `Technician ${technicianId} accepted the job from ${clientId} at location ${clientLocation.lat} ${clientLocation.lng}`
      );
    } else if (response === "reject") {
      io.to(clientSocket).emit("hire-rejected", {
        technicianId,
      });

      console.log(
        `Technician ${technicianId} rejected the job from ${clientId}`
      );
    }
  });

  socket.on("toggle-availability", (available) => {
    if (peers[socket.id] && peers[socket.id].role === "technician") {
      peers[socket.id].available = available;

      Object.keys(peers).forEach((peerSocketId) => {
        if (peers[peerSocketId].role === "user") {
          io.to(peerSocketId).emit(
            "peer-list",
            Object.values(peers).filter((peer) => peer.role === "technician")
          );
        }
      });
    }
  });

  socket.on("end-service", ({ clientId, technicianId }) => {
    const clientSocket = Object.keys(peers).find(
      (id) => peers[id].userId === clientId
    );
    const technicianSocket = Object.keys(peers).find(
      (id) => peers[id].userId === technicianId
    );

    if (peers[technicianSocket]) {
      peers[technicianSocket].available = true;
    }

    io.to(clientSocket).emit("service-ended", {
      message: "The job has been completed!",
    });
    io.to(technicianSocket).emit("service-ended", {
      message: "Job completed!",
    });

    console.log(
      `Job between client ${clientId} and technician ${technicianId} is complete.`
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    const peer = peers[socket.id];
    if (peer) {
      if (peer.role === "technician") {
        peer.available = false;
      }
    }
    delete peers[socket.id];
    Object.keys(peers).forEach((peerSocketId) => {
      if (peers[peerSocketId].role === "user") {
        io.to(peerSocketId).emit(
          "peer-list",
          Object.values(peers).filter((peer) => peer.role === "technician")
        );
      }
    });
  });
});

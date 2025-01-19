import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

// Connect to your signaling server
const socket = io("http://localhost:3002");

// Generate a unique user ID
const userId = uuidv4();

interface Peer {
  userId: string;
  role: string;
  location: { lat: number; lng: number } | null;
  available: boolean;
  hiredBy?: string;
}

const App = () => {
  const [role, setRole] = useState<"user" | "technician">("user");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [peerLocations, setPeerLocations] = useState<Peer[]>([]);
  const [hireStatus, setHireStatus] = useState<string | null>(null);
  const [available, setAvailable] = useState<boolean>(false);
  const [onJob, setOnJob] = useState<boolean>(false);
  const [hiredTechnician, setHiredTechnician] = useState<string | null>(null);
  const [hiringUser, setHiringUser] = useState<string | null>(null);
  const [serviceEndedMessage, setServiceEndedMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    socket.emit("register", { userId, role });
    console.log("Registered with userId:", userId, "as:", role);
  }, [role]);

  const generateRandomLocation = () => {
    const lat = (Math.random() * 180 - 90).toFixed(6);
    const lng = (Math.random() * 360 - 180).toFixed(6);
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
  };

  const sendRandomLocation = () => {
    const randomLocation = generateRandomLocation();
    setLocation(randomLocation);
    socket.emit("send-location", randomLocation);
  };

  useEffect(() => {
    sendRandomLocation();
    const interval = setInterval(sendRandomLocation, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on("peer-list", (peers: Peer[]) => {
      console.log(role);
      console.log("Updated peer list:", peers);
      setPeerLocations(peers);
    });

    return () => {
      socket.off("peer-list");
    };
  }, []);

  const toggleAvailability = () => {
    if (!onJob) {
      setAvailable(!available);
      socket.emit("toggle-availability", !available);
    }
  };

  const hireTechnician = (technicianId: string) => {
    setHireStatus("Waiting for response...");
    socket.emit("hire", { technicianId, clientId: userId });
  };

  useEffect(() => {
    socket.on("hire-accepted", ({ technicianId }) => {
      setHireStatus(`Technician ${technicianId} accepted the job!`);
      setOnJob(true);
      setHiredTechnician(technicianId);
    });

    socket.on("hire-rejected", ({ technicianId }) => {
      setHireStatus(`Technician ${technicianId} rejected the job.`);
    });

    socket.on("hire-request", ({ clientId, location }) => {
      if (role === "technician") {
        const accept = window.confirm(
          `Job from ${clientId} at location: ${location.lat}, ${location.lng}. Accept?`
        );
        socket.emit("hire-response", {
          response: accept ? "accept" : "reject",
          clientId,
          technicianId: userId,
        });
      }
    });

    socket.on("on-job", ({ clientId }) => {
      setOnJob(true);
      setHiringUser(clientId);
    });

    socket.on("service-ended", ({ message }) => {
      setServiceEndedMessage(message);
      setOnJob(false);
      setHireStatus(null);
      setHiredTechnician(null);
      setHiringUser(null);
    });

    return () => {
      socket.off("hire-accepted");
      socket.off("hire-rejected");
      socket.off("hire-request");
      socket.off("service-ended");
    };
  }, [role]);

  const endService = () => {
    if (role === "user") {
      socket.emit("end-service", {
        clientId: userId,
        technicianId: peerLocations.find(
          (peer) => peer.userId === hiredTechnician
        )?.userId,
      });
    } else if (role === "technician") {
      socket.emit("end-service", {
        clientId: peerLocations.find((peer) => peer.userId === hiringUser)
          ?.userId,
        technicianId: userId,
      });
    }
    setOnJob(false);
    setHiredTechnician(null);
    setHiringUser(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User ID: {userId}</h2>
      <h3>
        My Role:{" "}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "user" | "technician")}
        >
          <option value="user">User</option>
          <option value="technician">Technician</option>
        </select>
      </h3>
      <h3>
        My Location:{" "}
        {location
          ? `${location.lat}, ${location.lng}`
          : "Generating location..."}
      </h3>

      {role === "technician" && (
        <div>
          <button onClick={toggleAvailability} disabled={onJob}>
            {available ? "Go Offline" : "Go Online"}
          </button>
        </div>
      )}

      {role === "user" && (
        <>
          <h3>{hiredTechnician ? "Hired Technician:" : "Technicians:"}</h3>
          <ul>
            {peerLocations
              .filter((peer) => {
                if (hiredTechnician) {
                  return peer.userId === hiredTechnician;
                }
                return peer.role === "technician" && peer.available;
              })
              .map((peer) => (
                <li key={peer.userId}>
                  {peer.userId} - Status:{" "}
                  {peer.available ? "Available" : "On the way"} - Location:{" "}
                  {peer.location
                    ? `${peer.location.lat}, ${peer.location.lng}`
                    : "No location yet"}
                  {!onJob && peer.available && (
                    <button onClick={() => hireTechnician(peer.userId)}>
                      Hire
                    </button>
                  )}
                </li>
              ))}
          </ul>
        </>
      )}

      {role === "technician" && onJob && (
        <>
          <h3>Client:</h3>
          <ul>
            {peerLocations.map((peer) => (
              <li key={peer.userId}>
                {peer.userId} - Location:{" "}
                {peer.location
                  ? `${peer.location.lat}, ${peer.location.lng}`
                  : "No location yet"}
              </li>
            ))}
          </ul>
        </>
      )}

      {role === "technician" && !onJob && <h3>Waiting to be hired...</h3>}

      {role === "user" && hireStatus && <h3>{hireStatus}</h3>}

      {onJob && (
        <div>
          <button onClick={endService}>Finish Service</button>
        </div>
      )}

      {serviceEndedMessage && <h3>{serviceEndedMessage}</h3>}
    </div>
  );
};

export default App;

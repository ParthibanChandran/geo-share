import { useState, useEffect, Activity } from "react";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import Icon from "./utils/Icons8";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";

declare global {
  interface Window {
    __INITIAL_DATA__?: { name: string; keyField: string };
  }
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCopied, setIsCopied] = useState(false);
  const [roomIdExist, setRoomIdExist] = useState(false);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomPath, setRoomPath] = useState("");
  const [actualUrl, setActualUrl] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [isRenderMap, setIsRenderMap] = useState(false);
  const [iframeKey, setIframeKey] = useState(0)

  // const [fpHash, setFpHash] = useState("");

  // useEffect(() => {
  //   const setFp = async () => {
  //     const fp = await FingerprintJS.load();
  //     const { visitorId } = await fp.get();
  //     setFpHash(visitorId);
  //   };
  //   setFp();
  // }, []);

  // useEffect(() => {
  //   if (fpHash) {
  //     // Fetch user data using fpHash
  //     (async () => {
  //       try {
  //         const url = `${import.meta.env.VITE_SERVER_URL}/user/${fpHash}`;
  //         const response = await fetch(url);
  //         const data = await response.json();
  //         if (data.name) {
  //           setUserName(data.name);
  //         }
  //       } catch (error) {
  //         console.error("Error while fetching user:  ", error);
  //       }
  //     })();
  //   }
  // }, [fpHash]);

  useEffect(() => {
    const roomId = searchParams.get("room-id") ?? "";
    setRoomId(roomId);
    setRoomPath(roomId ? `${roomId}` : "");
    setActualUrl(roomId ? `${window.location.href}?room-id=${roomId}` : "");
    setRoomIdExist(roomId !== "");
    setSearchParams((prev) => {
      prev.delete("room-id");
      return prev;
    });
  }, []);

  // async function addUsers() {
  //   try {
  //     const url = `${
  //       import.meta.env.VITE_SERVER_URL
  //     }/user/add/${fpHash}/?name=${userName}`;
  //     const response = await fetch(url);
  //     if (!response.ok) {
  //       throw new Error("Request failed");
  //     }
  //     await response.json();
  //     console.log("response", response)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const renderMap = async (uniqueId: string) => {
    if (uniqueId && userName) {
      // await addUsers();
      setServerUrl(
        `${
          import.meta.env.VITE_SERVER_URL
        }/?roomId=${uniqueId}&name=${userName}`
      );
      setIsRenderMap(true);
    }
  };

  const joinRoom = () => {
    if (!userName.trim()) {
      setError("Name is required");
      return;
    }
    setError("");
    setRoomPath(`${roomId}/?name=${userName}`);
    renderMap(roomId);
  };

  const createRoom = () => {
    if (!userName.trim()) {
      setError("Name is required");
      return;
    }
    setError("");
    const uniqueId = crypto.randomUUID();
    const url = new URL(window.location.href);
    url.searchParams.set("room-id", uniqueId);
    setActualUrl(url.toString());
    setRoomId(uniqueId);
    setRoomPath(`${uniqueId}/?name=${userName}`);
    renderMap(uniqueId);
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(actualUrl);
    setIsCopied(true);
  };

  const shareUrl = async () => {
    await navigator.share({
      title: "Join my room",
      text: "Location Share",
      url: actualUrl,
    });
  };

  const openInNewTab = () =>
    window.open(actualUrl, "_blank", "noopener,noreferrer");

  const refreshIframe = () => setIframeKey((prev) => prev + 1);

  return (
    <div className="app-container">
      <main>
        <div className="card">
          <h1 className="title">📍 Live Location Sharing </h1>
          <div className="form-wrapper">
            <div className="url">
              <div className="form-row">
                <label htmlFor="name"> Enter name </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={userName}
                  readOnly={isRenderMap}
                  onChange={(e) => setUserName(e.target.value.trim())}
                  autoComplete="off"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
              </div>
              {roomIdExist ? (
                <button
                  onClick={joinRoom}
                  disabled={!userName || isRenderMap}
                  type="submit"
                  className="block"
                >
                  <Icon
                    src={
                      "https://img.icons8.com/color/48/user-group-man-woman--v2.png"
                    }
                    alt={"user-group-man-woman--v2"}
                  />
                  Join Room
                </button>
              ) : (
                <button
                  onClick={createRoom}
                  disabled={!userName || isRenderMap}
                  type="submit"
                  className="block"
                >
                  <Icon
                    src={"https://img.icons8.com/color/48/join-skin-type-7.png"}
                    alt={"join-skin-type-7"}
                  />
                  Create Room
                </button>
              )}
            </div>
            <Activity mode={isRenderMap ? "visible" : "hidden"}>
              <div className="url">
                <div className="form-row">
                  <label htmlFor="room-id"> Room Id </label>
                  <input
                    value={roomPath}
                    type="text"
                    name="room-id"
                    id="room-id"
                    readOnly
                  />
                </div>
                {false && (
                  <button onClick={openInNewTab}>
                    <Icon
                      src={"https://img.icons8.com/color/48/external-link.png"}
                      alt={"external-link"}
                    />
                    new tab
                  </button>
                )}
                <button onClick={copyUrl}>
                  {isCopied ? (
                    <Icon
                      src={"https://img.icons8.com/fluency/48/double-tick.png"}
                      alt={"double-tick"}
                    />
                  ) : (
                    <Icon
                      src={"https://img.icons8.com/color/48/copy-link.png"}
                      alt={"copy-link"}
                    />
                  )}
                  {isCopied ? "Link copied" : "Copy Link"}
                </button>
                <button onClick={shareUrl}>
                  <Icon
                    src={"https://img.icons8.com/stickers/48/share.png"}
                    alt={"share"}
                  />
                  Share
                </button>
                <button onClick={refreshIframe}>
                  <Icon
                    src={"https://img.icons8.com/arcade/64/refresh.png"}
                    alt={"refresh"}
                  />
                  Refresh Map
                </button>
              </div>
            </Activity>
          </div>
        </div>
        {isRenderMap && (
          <iframe
            key={iframeKey}
            src={serverUrl}
            title="External Content"
            width="100%"
            height="400"
            // Add security restrictions if needed
            sandbox="allow-scripts allow-same-origin allow-modals"
            allow="geolocation"
            loading="lazy" // Optimizes page load performance
          />
        )}
        <article>
          <h2>🔍 How does this work?</h2>
          <p>
            The browser uses the Geolocation API to continuously read the user’s
            latitude and longitude. These coordinates are sent to the server
            using Socket.IO, which enables real-time communication. The server
            temporarily keeps user locations in memory and broadcasts updates
            only to users inside the same room. When a user disconnects or
            closes the browser, their data is immediately removed. Clicking on
            another user’s marker calculates and displays a route using the OSRM
            routing service.
          </p>
          <h2>Technology Used</h2>
          <p>
            React is used for the user interface to enter the name and room ID.
            Node.js with JavaScript renders the live map on the server.
            Leaflet.js and OSM are used to display the map.
            Socket.IO handles real-time location updates.
          </p>
          <h2>Privacy &amp; Permissions</h2>
          <p>
            This app does not collect or store personal data. Location data is
            used only while the app is open and is never saved in a database.
            The only permission required is browser location (GPS) access, which
            can be revoked at any time from browser settings.
          </p>
        </article>
      </main>
      <footer>
        <div>
          Crafted by{" "}
          <a href="https://parthiban-c.vercel.app" target="_blank">
            Parthiban C
          </a>
          .
        </div>
      </footer>
    </div>
  );
}

export default App;

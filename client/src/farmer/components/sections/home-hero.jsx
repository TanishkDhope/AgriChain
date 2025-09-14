import React, { useEffect, useRef,useContext } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { gsap } from "gsap"
import { socketContext } from "../../../contexts/socketContext"
import { io } from "socket.io-client";
import { connect } from "../../../blockchain/product_registry"


export default function HomeHero() {
  const titleRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const [account, setAccount] = React.useState(null);
  const [requestData, setRequestData] = React.useState(null);
const [showRequestModal, setShowRequestModal] = React.useState(false);
const [price, setPrice] = React.useState("");



   const { socket, setSocket } = useContext(socketContext);
    // Step 1: Create socket only once
    useEffect(() => {
      if (!socket) {
        const sock = io("http://localhost:5000");
        setSocket(sock);
      }
    }, []);

    // Step 2: Wait for socket to exist, then register account
  useEffect(() => {
    if (!socket) return; // wait until socket is set

    const doConnect = async () => {
      const acc = await connect(); // connect wallet
      if (!acc) return;
      setAccount(acc);
      console.log("Socket is ready:", socket);
      console.log("Account:", acc);
      socket.emit("register", acc); // register with server
    };

    doConnect();
    // Handle new requests
    const handleNewRequest = (data) => {
      console.log("New buy request received:", data);
      setRequestData(data);
       setShowRequestModal(true); 
    };

    const handleAcceptRequest = (data) => {
      console.log("Your buy request was accepted:", data);
      handlePayment(
        data.price,
        data.farmer,
        data.tokenId,
        data.amountToken,
        data.buyer
      );
      // Further logic like notifying user can be added here
    };

    socket.on("new_request", handleNewRequest);

    socket.on("accept_request", handleAcceptRequest);

    socket.on("payment_success", (data) => {
      console.log("Payment successful for token:", data.tokenId);
      toast.success("Payment successful! Token transfer will be initiated.");
    });
    // optional cleanup if component unmounts
    return () => {
      socket.disconnect();
    };
  }, [socket]); // runs again when socket is set

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } })
    tl.fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
      .fromTo(subRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.2")
      .fromTo(ctaRef.current, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, "-=0.1")
  }, [])

  return (
    <div className="pt-24 md:pt-28 pb-12 md:pb-16 px-4 md:px-8 lg:px-12 bg-[linear-gradient(to_bottom,transparent,rgba(16,24,16,0.08))]">
      <div className="mx-auto max-w-6xl">
        <h1 ref={titleRef} className="text-3xl md:text-5xl font-bold text-balance">
          Farmer Portal for a Transparent Blockchain Supply Chain
        </h1>
        <p ref={subRef} className="mt-3 md:mt-4 text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          Add produce, view market trends, ask questions, and generate price journey reports. Modern, farmer-friendly,
          and built with fintech-grade polish.
        </p>

        <div ref={ctaRef} className="mt-6 flex items-center gap-3">
          <a href="#produce">
            <Button   className="cursor-pointer bg-emerald-600 hover:bg-emerald-700">Add Produce</Button>
          </a>
          <a href="#market">
            <Button className="cursor-pointer " variant="outline">View Request  </Button>
          </a>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="backdrop-blur-xl bg-background/60 border-emerald-200/30">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Blockchain</div>
              <div className="mt-1 font-semibold">Tamper-proof certificates</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-background/60 border-emerald-200/30">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Market Insights</div>
              <div className="mt-1 font-semibold">Locality price comparisons</div>
            </CardContent>
          </Card>
          <Card className="backdrop-blur-xl bg-background/60 border-emerald-200/30">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Reports</div>
              <div className="mt-1 font-semibold">Downloadable transparency</div>
            </CardContent>
          </Card>
        </div>
      </div>
      {showRequestModal && requestData && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
      {/* Close button */}
      <button
        onClick={() => setShowRequestModal(false)}
        className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4">New Buy Request</h2>

      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>Buyer:</strong> {requestData.buyer}</p>
        <p><strong>Batch ID:</strong> {requestData.tokenId}</p>
        <p><strong>Quantity:</strong> {requestData.amountToken}</p>
      </div>

      {/* Price Input */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Selling Price (₹)
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 250"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Accept Button */}
      <button
        onClick={() => {
          if (!price || price <= 0) {
            toast.error("Please enter a valid price before accepting.");
            return;
          }
          socket.emit("accept_request", {
            ...requestData,
            farmer: account,
            price: Number(price),
          });
          setShowRequestModal(false);
        }}
        className="mt-6 w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg"
      >
        Accept Request
      </button>
    </div>
  </div>
)}


    </div>
  )
}
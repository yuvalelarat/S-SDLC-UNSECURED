import { useEffect, useState } from "react";
import { TextField } from "../components/textField";
import { WhiteCard } from "../components/whiteCard";

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; email: string; phoneNumber: string }>({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (token) {
      fetchClients();
    }
  }, [token]);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/clients", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Clients fetched successfully:", data);
        if (data.clients) {
          setClients(data.clients);
        }
      }
    } catch (err) {
      console.error("An error occurred while fetching clients:", err);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/clients/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Client added successfully.");
        alert("Client added successfully.");
        setFormData({ name: "", email: "", phoneNumber: "" });
        setError(null);
        fetchClients();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add client.");
      }
    } catch (err) {
      console.error("An error occurred while adding client:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 justify-center items-center flex flex-col">
      <h1 className="text-4xl font-bold">Comunication_LTD </h1>
      {token ? <>
        <form className="flex flex-col items-center justify-center mt-10 border border-black rounded-lg w-1/7" onSubmit={handleSubmit}>
          <h3 className="p-2">Add new client:</h3>
          <TextField
            placeholder="Name"
            textFieldStyle="mb-4"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            value={formData.name}
            type="name"
          />
          <TextField
            placeholder="Email"
            textFieldStyle="mb-4"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            value={formData.email}
            type="email"
          />
          <TextField
            placeholder="Phone Number"
            textFieldStyle="mb-4"
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            value={formData.phoneNumber}
            type="phone"
          />
          <div className="min-h-5 pb-4">
            {<p className="text-red-500 text-sm">{`${error ? error : ''}`}</p>}
          </div>
          <button
            type="submit"
            className={`w-1/3 mb-4 text-white py-2 rounded ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600 hover:cursor-pointer '} `}
            disabled={isLoading}
          >
            Submit
          </button>
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-6 mt-10 justify-items-center">
          {clients.map((client, index) => (
            <WhiteCard key={index} middle={false}>
              <p className="font-bold" dangerouslySetInnerHTML={{ __html: client.name }} />
              <p className="font-bold" dangerouslySetInnerHTML={{ __html: client.email }} />
              <p className="font-bold" dangerouslySetInnerHTML={{ __html: client.phoneNumber }} />
            </WhiteCard>
          ))}
        </div>
      </> : <p>Please login to continue.</p>}

    </div>

  );
}

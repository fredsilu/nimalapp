import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AddClientForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Client ajouté :", form);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl p-6 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-700">Ajouter un Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div>
              <Label>Prénom</Label>
              <Input name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div>
              <Label>Adresse</Label>
              <Input name="address" value={form.address} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full mt-4">Ajouter</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

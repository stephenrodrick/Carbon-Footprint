import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Leaf, Users, BookOpen, Car, Home, Plane, ShoppingBag, Info, AlertCircle, Check } from 'lucide-react';

const CARBON_FACTORS = {
  electricity: {
    factor: 0.92,
    description: "Electricity generation from fossil fuels is a major source of CO2 emissions. The factor of 0.92 kg CO2 per kWh represents an average for mixed power sources.",
    tips: [
      "Use LED bulbs to reduce consumption by up to 80%",
      "Choose Energy Star certified appliances",
      "Consider solar panel installation for clean energy"
    ]
  },
  gas: {
    factor: 6.6,
    description: "Natural gas combustion releases CO2 directly into the atmosphere. The factor of 6.6 kg CO2 per therm reflects the complete combustion process.",
    tips: [
      "Improve home insulation to reduce heating needs",
      "Install a smart thermostat for optimal control",
      "Regular maintenance of heating systems"
    ]
  },
  vehicle: {
    factor: 0.404,
    description: "Vehicle emissions depend on fuel efficiency and driving patterns. The factor of 0.404 kg CO2 per mile is based on average car efficiency.",
    tips: [
      "Regular vehicle maintenance improves efficiency",
      "Adopt eco-driving techniques",
      "Consider switching to an electric vehicle"
    ]
  },
  flight: {
    factor: 90,
    description: "Air travel has a high carbon impact due to emissions at high altitudes. The factor of 90 kg CO2 per hour includes all flight phases.",
    tips: [
      "Combine trips to reduce flight frequency",
      "Choose direct flights when possible",
      "Consider train travel for shorter distances"
    ]
  },
  waste: {
    factor: 0.5,
    description: "Waste decomposition and processing contributes to emissions. The factor of 0.5 kg CO2 per kg waste includes transportation and processing.",
    tips: [
      "Start composting organic waste",
      "Reduce single-use plastics",
      "Practice recycling and proper waste sorting"
    ]
  },
  diet: {
    meat: { factor: 3.3, label: "Meat Heavy", description: "A diet high in red meat has the largest carbon footprint due to livestock emissions and land use." },
    mixed: { factor: 2.5, label: "Mixed Diet", description: "A balanced diet with moderate meat consumption has a medium carbon impact." },
    vegetarian: { factor: 1.7, label: "Vegetarian", description: "A vegetarian diet significantly reduces carbon emissions by avoiding meat products." },
    vegan: { factor: 1.5, label: "Vegan", description: "A vegan diet has the lowest carbon footprint by avoiding all animal products." }
  }
};

const InfoCard = ({ title, children }) => (
  <div className="bg-blue-50 p-4 rounded-lg mb-4">
    <div className="flex items-start gap-2">
      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
      <div>
        <h4 className="font-medium text-blue-700">{title}</h4>
        <p className="text-sm text-blue-600">{children}</p>
      </div>
    </div>
  </div>
);

const CalculatorSection = ({ label, icon: Icon, value, onChange, placeholder, description }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium flex items-center gap-2">
      {label}
      <button
        className="text-gray-400 hover:text-gray-600"
        onClick={() => alert(description)}
      >
        <Info className="h-4 w-4" />
      </button>
    </label>
    <div className="flex items-center space-x-2">
      <Icon className="h-4 w-4 text-gray-500" />
      <Input 
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="focus:ring-2 focus:ring-green-500"
      />
    </div>
  </div>
);

const CarbonCalculator = () => {
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    electricity: '',
    gas: '',
    vehicle: '',
    flights: '',
    waste: '',
    diet: 'mixed'
  });

  const calculateCarbon = () => {
    const calculations = {
      electricity: (parseFloat(formData.electricity) || 0) * CARBON_FACTORS.electricity.factor,
      gas: (parseFloat(formData.gas) || 0) * CARBON_FACTORS.gas.factor,
      vehicle: (parseFloat(formData.vehicle) || 0) * CARBON_FACTORS.vehicle.factor,
      flights: (parseFloat(formData.flights) || 0) * CARBON_FACTORS.flight.factor,
      waste: (parseFloat(formData.waste) || 0) * CARBON_FACTORS.waste.factor,
      diet: CARBON_FACTORS.diet[formData.diet].factor * 30
    };

    const total = Object.values(calculations).reduce((a, b) => a + b, 0);
    
    setResults({
      calculations,
      total: Math.round(total * 100) / 100,
      chartData: Object.entries(calculations).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: Math.round(value * 100) / 100
      }))
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-500" />
            Carbon Footprint Calculator
          </CardTitle>
          <CardDescription>
            Calculate your environmental impact and learn how to reduce it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InfoCard title="Why Calculate Your Carbon Footprint?">
            Understanding your carbon footprint is the first step toward reducing your environmental impact.
            This calculator helps you identify your major emission sources and provides personalized recommendations.
          </InfoCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {Object.entries(CARBON_FACTORS).map(([key, data]) => {
              if (key !== 'diet') {
                const Icon = key === 'electricity' ? Home :
                           key === 'gas' ? Home :
                           key === 'vehicle' ? Car :
                           key === 'flight' ? Plane :
                           ShoppingBag;
                
                return (
                  <CalculatorSection
                    key={key}
                    label={`Monthly ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    icon={Icon}
                    value={formData[key]}
                    onChange={(e) => setFormData({...formData, [key]: e.target.value})}
                    placeholder={`Enter ${key} usage`}
                    description={data.description}
                  />
                );
              }
              return null;
            })}

            <div className="space-y-2">
              <label className="text-sm font-medium">Diet Type</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={formData.diet}
                onChange={(e) => setFormData({...formData, diet: e.target.value})}
              >
                {Object.entries(CARBON_FACTORS.diet).map(([key, data]) => (
                  <option key={key} value={key}>{data.label}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={calculateCarbon}
          >
            Calculate Carbon Footprint
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card className="border-t-4 border-t-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-6 w-6 text-blue-500" />
              Your Carbon Footprint Results
            </CardTitle>
            <CardDescription>
              Total Monthly Emissions: {results.total} kg CO2
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {results.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {Object.entries(results.calculations).map(([category, value]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                      <span className="text-sm">{Math.round(value * 100) / 100} kg CO2</span>
                    </div>
                    <Progress value={(value / results.total) * 100} className="h-2" />
                    <div className="text-sm text-gray-600">
                      {CARBON_FACTORS[category]?.tips?.[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">Carbon Footprint Calculator</h1>
        <p className="text-gray-600">Calculate, understand, and reduce your environmental impact</p>
      </header>
      <CarbonCalculator />
    </div>
  );
};

export default App;

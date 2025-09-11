import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Plus, Trash2, CheckCircle, Clock, AlertTriangle, DollarSign } from "lucide-react"
import { farmers, contracts, filterOptions } from "../lib/data"

export default function Contracts() {
  const [contractForm, setContractForm] = useState({
    farmer: "",
    produce: "",
    quantity: "",
    unit: "",
    pricePerUnit: "",
    deliveryDate: ""
  })
  const [contractsData, setContractsData] = useState(contracts)
  const [livePreview, setLivePreview] = useState({})

  // Enhanced live preview with better formatting
  useEffect(() => {
    const selectedFarmer = farmers.find(f => f.name.toLowerCase().replace(/\s+/g, '') === contractForm.farmer.toLowerCase().replace(/\s+/g, ''))
    const quantity = parseFloat(contractForm.quantity) || 0
    const pricePerUnit = parseFloat(contractForm.pricePerUnit) || 0
    const totalValue = quantity * pricePerUnit

    setLivePreview({
      farmer: selectedFarmer?.name || "Select farmer...",
      farmerLocation: selectedFarmer?.location || "",
      produce: contractForm.produce || "Enter produce type...",
      quantity: contractForm.quantity && contractForm.unit ? `${contractForm.quantity} ${contractForm.unit}` : "Enter quantity...",
      pricePerUnit: contractForm.pricePerUnit ? `$${parseFloat(contractForm.pricePerUnit).toFixed(2)}` : "$0.00",
      totalValue: totalValue > 0 ? `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00",
      delivery: contractForm.deliveryDate || "Select date...",
      contractId: `CNT-${String(contractsData.length + 1).padStart(3, '0')}`,
      isComplete: contractForm.farmer && contractForm.produce && contractForm.quantity && contractForm.unit && contractForm.pricePerUnit && contractForm.deliveryDate
    })
  }, [contractForm, contractsData.length])

  const handleInputChange = (field, value) => {
    setContractForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateContract = () => {
    if (!livePreview.isComplete) {
      return
    }

    const selectedFarmer = farmers.find(f => f.name.toLowerCase().replace(/\s+/g, '') === contractForm.farmer.toLowerCase().replace(/\s+/g, ''))
    const totalValue = parseFloat(contractForm.quantity) * parseFloat(contractForm.pricePerUnit)
    
    const newContract = {
      id: `CNT-${String(contractsData.length + 1).padStart(3, '0')}`,
      farmer: selectedFarmer.name,
      farmerId: selectedFarmer.id,
      produce: contractForm.produce,
      quantity: `${contractForm.quantity} ${contractForm.unit}`,
      pricePerUnit: parseFloat(contractForm.pricePerUnit),
      totalValue: totalValue,
      status: "Pending",
      delivery: contractForm.deliveryDate,
      createdDate: new Date().toISOString().split('T')[0],
      blockchainHash: `0x${Math.random().toString(16).substr(2, 16)}`
    }

    setContractsData([newContract, ...contractsData])
    
    // Reset form
    setContractForm({
      farmer: "",
      produce: "",
      quantity: "",
      unit: "",
      pricePerUnit: "",
      deliveryDate: ""
    })
  }

  const handleDeleteContract = (contractId) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      setContractsData(contractsData.filter(c => c.id !== contractId))
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Expired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />
      case "Expired":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <section 
      id="contracts" 
      className="py-16 px-6" 
      style={{ scrollMarginTop: '30px' }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Smart Contracts</h2>
          <p className="text-gray-600">Create and manage blockchain-based agreements</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          
          {/* Contract Form */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Create New Contract</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Farmer *</label>
                <Select onValueChange={(value) => handleInputChange('farmer', value)} value={contractForm.farmer}>
                  <SelectTrigger className="h-12 border-gray-200">
                    <SelectValue placeholder="Choose a farmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {farmers.map((farmer) => (
                      <SelectItem key={farmer.id} value={farmer.name.toLowerCase().replace(/\s+/g, '')}>
                        <div className="flex items-center justify-between w-full">
                          <span>{farmer.name}</span>
                          <span className="text-sm text-gray-500 ml-2">{farmer.produce}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Produce Type *</label>
                <Input 
                  placeholder="e.g., Organic Tomatoes" 
                  className="h-12 border-gray-200"
                  value={contractForm.produce}
                  onChange={(e) => handleInputChange('produce', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Quantity *</label>
                  <Input 
                    placeholder="1000" 
                    type="number"
                    className="h-12 border-gray-200"
                    value={contractForm.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Unit *</label>
                  <Select onValueChange={(value) => handleInputChange('unit', value)} value={contractForm.unit}>
                    <SelectTrigger className="h-12 border-gray-200">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Price per Unit ($) *</label>
                <Input 
                  placeholder="2.50" 
                  type="number"
                  step="0.01"
                  className="h-12 border-gray-200"
                  value={contractForm.pricePerUnit}
                  onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Delivery Date *</label>
                <Input 
                  type="date" 
                  className="h-12 border-gray-200"
                  value={contractForm.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <Button 
                className="w-full h-12 text-base"
                onClick={handleCreateContract}
                disabled={!livePreview.isComplete}
              >
                Create Contract
              </Button>
            </CardContent>
          </Card>
          
          {/* Live Preview */}
          <Card className={`border-0 shadow-sm ${livePreview.isComplete ? 'ring-2 ring-green-100' : ''}`}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Contract Preview</span>
                {livePreview.isComplete && (
                  <Badge className="bg-green-100 text-green-800">Ready to Create</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
                <div className="text-center pb-4 border-b border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900">Smart Contract Agreement</h3>
                  <p className="text-sm text-blue-600 mt-1">Contract ID: {livePreview.contractId}</p>
                  <p className="text-xs text-gray-500 mt-1">Blockchain-secured agricultural contract</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Farmer:</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{livePreview.farmer}</div>
                      {livePreview.farmerLocation && (
                        <div className="text-xs text-gray-500">{livePreview.farmerLocation}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Produce:</span>
                    <span className="font-semibold text-gray-900">{livePreview.produce}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Quantity:</span>
                    <span className="font-semibold text-gray-900">{livePreview.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Price per Unit:</span>
                    <span className="font-semibold text-gray-900">{livePreview.pricePerUnit}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 bg-green-50 px-3 rounded-lg">
                    <span className="text-gray-600 font-medium flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Total Value:
                    </span>
                    <span className="font-bold text-green-700 text-lg">{livePreview.totalValue}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Delivery Date:</span>
                    <span className="font-semibold text-gray-900">{livePreview.delivery}</span>
                  </div>
                </div>
                
                <div className="border-t border-blue-100 pt-4">
                  <p className="text-xs text-gray-500 text-center">
                    {livePreview.isComplete 
                      ? "✅ Contract ready for blockchain deployment"
                      : "⚠️ Complete all fields to finalize contract"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Active Contracts Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Contracts ({contractsData.length})</CardTitle>
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                Total Value: ${contractsData.reduce((sum, c) => sum + (c.totalValue || 0), 0).toLocaleString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contract ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Farmer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Produce</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Value</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Delivery</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contractsData.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <code className="text-sm text-gray-800">{contract.id}</code>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{contract.farmer}</td>
                      <td className="px-6 py-4 text-gray-700">{contract.produce}</td>
                      <td className="px-6 py-4 text-gray-700">{contract.quantity}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">
                          ${contract.totalValue?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(contract.status)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(contract.status)}`}>
                            {contract.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{contract.delivery}</td>
                      <td className="px-6 py-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteContract(contract.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

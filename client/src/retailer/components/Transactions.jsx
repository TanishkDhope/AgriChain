import { useState } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Download, Search, Check } from "lucide-react"
import { transactions } from "../lib/data"

export default function Transactions() {
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [copiedHash, setCopiedHash] = useState("")

  // Filter transactions based on search and status
  const filterTransactions = (term, status) => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.farmer.toLowerCase().includes(term.toLowerCase()) ||
                           transaction.lot.toLowerCase().includes(term.toLowerCase()) ||
                           transaction.hash.toLowerCase().includes(term.toLowerCase())
      const matchesStatus = status === "all" || transaction.status.toLowerCase() === status.toLowerCase()
      
      return matchesSearch && matchesStatus
    })
    setFilteredTransactions(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    filterTransactions(term, statusFilter)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    filterTransactions(searchTerm, status)
  }

  // Working copy to clipboard function
  const copyToClipboard = async (hash) => {
    try {
      await navigator.clipboard.writeText(hash)
      setCopiedHash(hash)
      // Reset after 2 seconds
      setTimeout(() => setCopiedHash(""), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = hash
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        setCopiedHash(hash)
        setTimeout(() => setCopiedHash(""), 2000)
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
      document.body.removeChild(textArea)
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Transaction ID", "Farmer", "Lot ID", "Date", "Amount", "Status", "Hash"],
      ...filteredTransactions.map(t => [
        t.id, t.farmer, t.lot, t.date, t.amount, t.status, t.hash
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Enhanced status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTotalConfirmed = () => {
    return filteredTransactions
      .filter(t => t.status === "Confirmed")
      .reduce((sum, t) => sum + t.amount, 0)
  }

  return (
    <section 
      id="transactions" 
      className="py-16 px-6 bg-gray-50" 
      style={{ scrollMarginTop: '30px' }}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-left">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Transaction History</h2>
          <p className="text-gray-600">Track all blockchain transactions and payments</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by farmer, lot ID, or hash..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 h-12 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <Select onValueChange={handleStatusFilter} value={statusFilter}>
                <SelectTrigger className="lg:w-48 h-12 border-gray-200">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button 
                variant="outline" 
                onClick={exportToCSV}
                className="h-12 px-6"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-6 text-sm bg-gray-50 p-4 rounded-lg">
              <span className="font-medium">
                Showing: <span className="text-blue-600">{filteredTransactions.length}</span> of {transactions.length}
              </span>
              <span className="font-medium">
                Confirmed: <span className="text-green-600">${getTotalConfirmed().toLocaleString()}</span>
              </span>
              <span className="font-medium">
                Pending: <span className="text-yellow-600">{filteredTransactions.filter(t => t.status === "Pending").length}</span>
              </span>
              <span className="font-medium">
                Failed: <span className="text-red-600">{filteredTransactions.filter(t => t.status === "Failed").length}</span>
              </span>
              <span className="font-medium">
                Completed: <span className="text-blue-600">{filteredTransactions.filter(t => t.status === "Completed").length}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Farmer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Lot ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Transaction Hash</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{transaction.farmer}</div>
                          <div className="text-sm text-gray-500">ID: {transaction.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <code className="bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm">
                            {transaction.lot}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{transaction.date}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-green-600">
                            ${transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <code className="text-xs text-gray-600 block truncate max-w-32">
                            {transaction.hash}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(transaction.hash)}
                            className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all ${
                              copiedHash === transaction.hash ? 'bg-green-50 text-green-700' : ''
                            }`}
                          >
                            {copiedHash === transaction.hash ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied!
                              </>
                            ) : (
                              'Copy Hash'
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

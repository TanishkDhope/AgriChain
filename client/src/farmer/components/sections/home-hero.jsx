import React from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { TrendingUp, Package, Users, Shield, BarChart3, Leaf, Sprout } from "lucide-react"

export default function HomeHero() {
  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 px-4 md:px-8 lg:px-12 py-12 md:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Farmer
            <span className="text-emerald-600"> Dashboard</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Manage your produce, track market trends, connect with buyers, and generate comprehensive reports. 
            Built with blockchain transparency and fintech-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 h-12">
              Get Started
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg h-12">
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature Cards - Professional Color Scheme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Produce Management</h3>
              <p className="text-gray-600">Organize and track your agricultural products with ease</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Analytics</h3>
              <p className="text-gray-600">Real-time price trends and market insights</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Network Connect</h3>
              <p className="text-gray-600">Connect with retailers and distributors</p>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Security</h3>
              <p className="text-gray-600">Transparent and secure transaction records</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Statistics Section - Same as Retailer Style */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Farmers Across India</h2>
            <p className="text-gray-600">Join thousands of farmers using modern tools for agricultural success</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">2,500+</div>
              <div className="text-sm text-gray-600">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">₹50L+</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">15,000+</div>
              <div className="text-sm text-gray-600">Contracts Signed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState } from "react";
import { User, LogOut, Package, Leaf } from "lucide-react";
import { useTranslation } from "../i18n/config";
import LanguageDropdown from "./LanguageDropdown";
import Notification from "./Notification";

export default function Header({ scanCount }) {
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notification, setNotification] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("scanHistory");
    localStorage.removeItem("userSession");
    localStorage.removeItem("issueReports");
    setShowUserMenu(false);
    setNotification(t("header.logoutSuccess"));
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Leaf className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t("header.title")}</h1>
                <p className="text-green-200 text-sm">{t("header.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2">
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">{scanCount} {t("header.scans")}</span>
              </div>
              <LanguageDropdown />
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <User className="h-6 w-6" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="font-medium text-gray-900">{t("header.consumer")}</p>
                      <p className="text-xs text-gray-500">demo@agricchain.com</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("header.logout")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
      <Notification message={notification} />
    </>
  );
}

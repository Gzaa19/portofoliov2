"use client";

import { useEffect, useState, useCallback } from "react";

interface Location {
    id: string;
    name: string;
    address?: string;
    latitude: number;
    longitude: number;
    zoom: number;
    isActive: boolean;
}

interface GeocodingResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
}

export default function AdminLocationPage() {
    const [location, setLocation] = useState<Location | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        latitude: 0,
        longitude: 0,
        zoom: 12,
        isActive: true,
    });
    const [isEditing, setIsEditing] = useState(false);

    const fetchLocation = useCallback(async () => {
        try {
            const res = await fetch("/api/location?all=true");
            const data = await res.json();
            // API returns array when ?all=true, get the active one or first one
            const locationData = Array.isArray(data)
                ? data.find((l: Location) => l.isActive) || data[0]
                : data;
            setLocation(locationData);
            if (locationData) {
                setFormData({
                    name: locationData.name,
                    address: locationData.address || "",
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    zoom: locationData.zoom,
                    isActive: locationData.isActive,
                });
            }
        } catch (error) {
            console.error("Failed to fetch location:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            setSearchResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (result: GeocodingResult) => {
        setFormData({
            ...formData,
            name: result.name.split(",")[0] + ", " + (result.name.split(",").slice(-1)[0] || "").trim(),
            address: result.address,
            latitude: result.latitude,
            longitude: result.longitude,
        });
        setSearchResults([]);
        setSearchQuery("");
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setFormData({
            name: "",
            address: "",
            latitude: 0,
            longitude: 0,
            zoom: 12,
            isActive: true,
        });
        setSearchQuery("");
        setSearchResults([]);
        setIsModalOpen(true);
    };

    const openEditModal = () => {
        if (location) {
            setIsEditing(true);
            setFormData({
                name: location.name,
                address: location.address || "",
                latitude: location.latitude,
                longitude: location.longitude,
                zoom: location.zoom,
                isActive: location.isActive,
            });
            setSearchQuery("");
            setSearchResults([]);
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing && location) {
                await fetch(`/api/location/${location.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
            } else {
                const res = await fetch("/api/location", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });

                if (!res.ok) {
                    const data = await res.json();
                    alert(data.error);
                    return;
                }
            }

            setIsModalOpen(false);
            fetchLocation();
        } catch (error) {
            console.error("Failed to save location:", error);
        }
    };

    const handleToggleActive = async () => {
        if (!location) return;

        try {
            await fetch(`/api/location/${location.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !location.isActive }),
            });
            fetchLocation();
        } catch (error) {
            console.error("Failed to toggle location:", error);
        }
    };

    const handleDelete = async () => {
        if (!location) return;
        if (!confirm("Yakin ingin menghapus lokasi ini?")) return;

        try {
            await fetch(`/api/location/${location.id}`, { method: "DELETE" });
            setLocation(null);
            setFormData({
                name: "",
                address: "",
                latitude: 0,
                longitude: 0,
                zoom: 12,
                isActive: true,
            });
        } catch (error) {
            console.error("Failed to delete location:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Location</h1>
                    <p className="text-white/50">Kelola lokasi yang ditampilkan di peta</p>
                </div>
                {!location && (
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all"
                    >
                        + Set Location
                    </button>
                )}
            </div>

            {/* Current Location Card */}
            {isLoading ? (
                <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center text-white/50">
                    Loading...
                </div>
            ) : location ? (
                <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                    {/* Map Preview */}
                    <div className="relative h-64 bg-gray-900">
                        <iframe
                            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${location.latitude},${location.longitude}&zoom=${location.zoom}&maptype=roadmap`}
                            className="w-full h-full border-0"
                            style={{ filter: "invert(90%) hue-rotate(180deg)" }}
                            allowFullScreen
                            loading="lazy"
                        />
                        <div className="absolute top-4 left-4">
                            <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${location.isActive
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                    }`}
                            >
                                {location.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>

                    {/* Location Info */}
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-white mb-2">{location.name}</h2>
                        {location.address && (
                            <p className="text-white/50 text-sm mb-4 line-clamp-2">{location.address}</p>
                        )}

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-900/50 rounded-xl p-4">
                                <div className="text-white/50 text-xs mb-1">Latitude</div>
                                <div className="text-white font-mono text-sm">{location.latitude?.toFixed(6) ?? 'N/A'}</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4">
                                <div className="text-white/50 text-xs mb-1">Longitude</div>
                                <div className="text-white font-mono text-sm">{location.longitude?.toFixed(6) ?? 'N/A'}</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-xl p-4">
                                <div className="text-white/50 text-xs mb-1">Zoom Level</div>
                                <div className="text-white font-mono text-sm">{location.zoom ?? 12}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={openEditModal}
                                className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors font-medium"
                            >
                                Edit Location
                            </button>
                            <button
                                onClick={handleToggleActive}
                                className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${location.isActive
                                    ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                    }`}
                            >
                                {location.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-12 text-center">
                    <div className="text-6xl mb-4">📍</div>
                    <h3 className="text-xl font-bold text-white mb-2">Belum ada lokasi</h3>
                    <p className="text-white/50 mb-6">Tambahkan lokasi untuk ditampilkan di peta About page</p>
                    <button
                        onClick={openCreateModal}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all"
                    >
                        + Set Location
                    </button>
                </div>
            )}

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <span className="text-3xl">💡</span>
                    <div>
                        <h3 className="text-white font-semibold mb-1">Tentang Lokasi</h3>
                        <p className="text-white/70 text-sm">
                            Hanya boleh ada 1 lokasi aktif pada satu waktu. Jika lokasi sudah ada,
                            kamu bisa edit lokasi tersebut atau matikan dulu sebelum menambah lokasi baru.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing ? "Edit Location" : "Set Location"}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Search Location */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Cari Lokasi
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                                        className="flex-1 px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                                        placeholder="Jakarta, Indonesia"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
                                    >
                                        {isSearching ? "..." : "🔍"}
                                    </button>
                                </div>

                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="mt-2 bg-gray-900/50 border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.id}
                                                type="button"
                                                onClick={() => handleSelectLocation(result)}
                                                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <div className="text-white text-sm font-medium truncate">
                                                    {result.name.split(",")[0]}
                                                </div>
                                                <div className="text-white/50 text-xs truncate">
                                                    {result.address}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Nama Lokasi
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                                    placeholder="Jakarta, Indonesia"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Alamat Lengkap (opsional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50"
                                    placeholder="Alamat lengkap..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={isNaN(formData.latitude) ? '' : formData.latitude}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setFormData({ ...formData, latitude: isNaN(val) ? 0 : val });
                                        }}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={isNaN(formData.longitude) ? '' : formData.longitude}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            setFormData({ ...formData, longitude: isNaN(val) ? 0 : val });
                                        }}
                                        className="w-full px-4 py-2 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 font-mono text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Zoom Level (1-20)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={formData.zoom ?? 12}
                                    onChange={(e) => setFormData({ ...formData, zoom: parseInt(e.target.value) || 12 })}
                                    className="w-full"
                                />
                                <div className="text-center text-white/50 text-sm">{formData.zoom ?? 12}</div>
                            </div>


                            {/* Preview */}
                            {formData.latitude !== 0 && formData.longitude !== 0 && (
                                <div className="rounded-xl overflow-hidden h-40">
                                    <iframe
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${formData.latitude},${formData.longitude}&zoom=${formData.zoom}&maptype=roadmap`}
                                        className="w-full h-full border-0"
                                        style={{ filter: "invert(90%) hue-rotate(180deg)" }}
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all"
                                >
                                    {isEditing ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

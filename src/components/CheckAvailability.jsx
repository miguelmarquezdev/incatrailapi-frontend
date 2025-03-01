import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingDots from "./LoadingDots";

function CheckAvailability() {
    const [date, setDate] = useState(new Date());
    const [route, setRoute] = useState("4d");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const routeLinks = {
        "4d": "https://happygringotours.com/tour/4-day-inca-trail-to-machu-picchu-best-inca-trailtours/",
        "2d": "https://happygringotours.com/tour/two-day-inca-trail-to-machu-picchu-short-inca-trail-peru/"
    };
    
    const contactLink = "https://happygringotours.com/contact/";

    useEffect(() => {
        fetchAvailability();
    }, [date, route]);

    const fetchAvailability = async () => {
        setLoading(true);
        setError(null);
        setData(null);

        const selectedYear = date.getFullYear();
        const selectedMonth = (date.getMonth() + 1).toString().padStart(2, "0");

        try {
            const response = await fetch("http://localhost:5000/api/disponibilidad", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ year: selectedYear, month: selectedMonth, route: route })
            });

            if (!response.ok) throw new Error("Error en la solicitud");
            
            const result = await response.json();
            setData(result.data);
            console.log(result.data)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderCalendar = () => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");

        const firstDay = new Date(year, date.getMonth(), 1).getDay();
        const daysInMonth = new Date(year, date.getMonth() + 1, 0).getDate();
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const emptyCells = Array.from({ length: firstDay }, () => null);
        const allDays = [...emptyCells, ...days];

        return (
            <table className="w-full border-collapse text-center">
                <thead>
                    <tr className="bg-gray-100">
                        {["L", "M", "X", "J", "V", "S", "D"].map(day => (
                            <th key={day} className="p-3 font-semibold">{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: Math.ceil(allDays.length / 7) }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                            {allDays.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex) => {
                                if (!day) return <td key={colIndex} className="p-4 bg-gray-50"></td>;
                                const formattedDate = `${year}-${month}-${String(day).padStart(2, "0")}`;
                                const availability = data?.[formattedDate];
                                const link = availability === 0 ? contactLink : routeLinks[route];
                                return (
                                    <td key={colIndex} className="p-4 border border-neutral-100 rounded-md shadow bg-white">
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-bold">{day}</span>
                                            {loading ? (
                                                <span className="text-blue-500 text-sm">
                                                    <LoadingDots />
                                                </span>
                                            ) : availability !== undefined ? (
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-sm p-1 rounded-md font-semibold ${availability === 0 ? 'text-red-500 font-black' : availability < 50 ? 'bg-red-500 text-white' : availability < 100 ? 'bg-yellow-300 text-black' : 'bg-green-400 text-white'}`}>
                                                        {availability === 0 ? "Sold Out" : `${availability} left`}
                                                    </span>
                                                    <a href={link} target="_blank" className={`mt-1 text-sm ${availability === 0 ? "text-neutral-300" : "text-black font-semibold hover:text-blue-700 transition-all duration-300"}`}>
                                                        {availability === 0 ? "Contact Us" : "Book Now"}
                                                    </a>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-sm">Contact us</span>
                                            )}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Inca Trail 4 Days</h2>

            <div className="flex justify-center space-x-4 mb-4">
                <label className="font-semibold">Ruta:</label>
                <select
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="4d">Inca Trail 4 Days</option>
                    <option value="2d">Inca Trail 2 Days</option>
                </select>
            </div>

            <DatePicker
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                dateFormat="MMMM yyyy"
                showMonthYearPicker
                className="w-full p-2 border rounded mb-4 text-center"
            />

            {error && <p className="mt-4 text-red-500 text-center">Error: {error}</p>}

            <div className="mt-4 overflow-x-auto">
                {renderCalendar()}
            </div>
        </div>
    );
}

export default CheckAvailability;

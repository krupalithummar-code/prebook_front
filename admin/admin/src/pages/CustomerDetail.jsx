import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

const CustomerDetail = () => {
    const navigate = useNavigate();
    const backend_Url = "https://prebook-zvko.vercel.app"
    const [adminData, setAdminData] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10; // records per page

    const fetchAdminData = async (pageNumber = 1) => {
        try {
            const response = await fetch(`${backend_Url}/admindata?page=${pageNumber}&limit=${limit}`, {
                method: "GET",
                credentials: "include"
            })
            const result = await response.json()
            if (response.ok) {
                // Format discount field before saving in state
                const formattedData = (result?.data || []).map((item) => {
                    if (item.discount_method === "amount") {
                        return {
                            ...item,
                            discountDisplay: `₹${item.amount}`,
                        };
                    } else if (item.discount_method === "percentage") {
                        return {
                            ...item,
                            discountDisplay: `${item.percentage}%`,
                        };
                    }
                    return item;
                });

                setAdminData(formattedData)
                setPage(result.pagination.page)
                setTotalPages(result.pagination.totalPages)
            } else {
                console.error(result.message || "Failed to fetch admin data")
            }
        } catch (err) {
            console.error("Error fetching admin data:", err)
        }
    }

    useEffect(() => {
        fetchAdminData(page)
    }, [page])

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            const response = await fetch(`${backend_Url}/customerdiscount/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const result = await response.json();

            if (response.ok) {
                setAdminData((prev) => prev.filter(item => item._id !== id));
            } else {
                console.error(result.message || "Failed to delete record");
            }
        } catch (err) {
            console.error("Error deleting record:", err);
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1)
    }

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1)
    }

    return (
        <div>
            <h2>Admin Data</h2>
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
                ⬅ Back
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>productId Prebook</th>
                        <th>productId Main</th>
                        <th>Discount Amount</th>
                        <th>Date</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {adminData.map((item, i) => (
                        <tr key={i}>
                            <td>{item.email}</td>
                            <td>{item.productTitlePrebook}</td>
                            <td>{item.productTitleMain}</td>
                            <td>{item.discountDisplay}</td>
                            <td>{item.created}</td>
                            <td className="remove_data text-center">
                                <svg
                                    onClick={() => handleDelete(item._id)}
                                    xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20px" height="20px" viewBox="0 0 24 24" className="icon glyph"><path d="M17,4V5H15V4H9V5H7V4A2,2,0,0,1,9,2h6A2,2,0,0,1,17,4Z" /><path d="M20,6H4A1,1,0,0,0,4,8H5.07l.87,12.14a2,2,0,0,0,2,1.86h8.14a2,2,0,0,0,2-1.86L18.93,8H20a1,1,0,0,0,0-2ZM13,17a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Z" /></svg>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button onClick={handlePrev} disabled={page === 1}>Prev</button>
                <span style={{ margin: "0 10px" }}>Page {page} of {totalPages}</span>
                <button onClick={handleNext} disabled={page === totalPages}>Next</button>
            </div>
        </div>
    )
}

export default CustomerDetail


// const CustomerDetail = () => {
//     const navigate = useNavigate();
//     const backend_Url = "http://localhost:8000"
//     const [adminData, setAdminData] = useState([])

//     useEffect(() => {
//         const fetchAdminData = async () => {
//             try {
//                 const response = await fetch(`${backend_Url}/admindata`, {
//                     method: "GET",
//                     credentials: "include"
//                 })
//                 const result = await response.json()
//                 if (response.ok) {
//                     setAdminData(result?.data || [])
//                 } else {
//                     console.error(result.message || "Failed to fetch admin data")
//                 }
//             } catch (err) {
//                 console.error("Error fetching admin data:", err)
//             }
//         }

//         fetchAdminData()
//     }, [])


//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this record?")) return;

//         try {
//             const response = await fetch(`${backend_Url}/customerdiscount/${id}`, {
//                 method: "DELETE",
//                 credentials: "include"
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 setAdminData((prev) => prev.filter(item => item._id !== id));
//             } else {
//                 console.error(result.message || "Failed to delete record");
//             }
//         } catch (err) {
//             console.error("Error deleting record:", err);
//         }
//     };



//     return (
//         <div>

//             <h2></h2>
//             <h2>Admin Data</h2>
//             <button className="back-btn" onClick={() => navigate("/dashboard")}>
//                 ⬅ Back
//             </button>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Email</th>
//                         <th>productId Prebook</th>
//                         <th>productId Main</th>
//                         <th>Discount Amount</th>
//                         <th>Date</th>
//                         <th>Delete</th>


//                     </tr>
//                 </thead>
//                 <tbody>
//                     {adminData.map((item, i) => (
//                         <tr key={i}>
//                             <td>{item.email}</td>
//                             <td>{item.productIdPrebook}</td>
//                             <td>{item.productIdMain}</td>
//                             <td>{item.amount}</td>
//                             <td>{item.created}</td>
//                             <td class="remove_data text-center">
//                                 <svg
//                                     onClick={() => handleDelete(item._id)}
//                                     xmlns="http://www.w3.org/2000/svg" fill="#000000" width="20px" height="20px" viewBox="0 0 24 24" id="delete-alt-2" class="icon glyph"><path d="M17,4V5H15V4H9V5H7V4A2,2,0,0,1,9,2h6A2,2,0,0,1,17,4Z" /><path d="M20,6H4A1,1,0,0,0,4,8H5.07l.87,12.14a2,2,0,0,0,2,1.86h8.14a2,2,0,0,0,2-1.86L18.93,8H20a1,1,0,0,0,0-2ZM13,17a1,1,0,0,1-2,0V11a1,1,0,0,1,2,0Z" /></svg>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     )
// }

// export default CustomerDetail

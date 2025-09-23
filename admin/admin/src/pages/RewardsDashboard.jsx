// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from "react-toastify";
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// const RewardsDashboard = () => {
//     const navigate = useNavigate();
//     const backend_Url = "https://prebook-zvko.vercel.app/"

//     const [customers, setCustomers] = useState([]);
//     const [filter, setFilter] = useState('all');
//     const [searchText, setSearchText] = useState('');
//     const [selectedIds, setSelectedIds] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [formVisible, setFormVisible] = useState(false);
//     const [formData, setFormData] = useState({
//         email: '',
//         amount: '',
//         productIdPrebook: '',
//         productIdMain: ''
//     });

//     const [productList, setProductList] = useState([]);
//     const [productCursor, setProductCursor] = useState(null); // current cursor
//     const [cursorStack, setCursorStack] = useState([]); // to track previous cursors for "Prev"
//     const [hasMoreProducts, setHasMoreProducts] = useState(true);

//     const [customerPage, setCustomerPage] = useState(1);
//     const [customerTotalPages, setCustomerTotalPages] = useState(1);
//     const limit = 10;

//     const loadNextPage = () => {
//         if (hasMoreProducts) {
//             getProductList(productCursor);
//         }
//     };

//     const loadPrevPage = () => {
//         if (cursorStack.length > 1) {
//             const newStack = [...cursorStack];
//             newStack.pop(); // remove current cursor
//             const prevCursor = newStack.pop(); // get previous cursor
//             setCursorStack(newStack);
//             getProductList(prevCursor);
//         } else {
//             // First page
//             getProductList(null);
//             setCursorStack([]);
//         }
//     };

//     const getCustomerData = async (pageNum = customerPage) => {
//         try {
//             const response = await fetch(`${backend_Url}/data?page=${pageNum}&limit=${limit}`, {
//                 method: "GET",
//                 credentials: "include"
//             });

//             const data = await response.json();
//             if (!response.ok) {
//                 if (!data.success) {
//                     navigate('/login');
//                 }
//                 console.error('Login failed:', data.message || 'Unknown error');
//                 return;
//             }

//             setCustomers(data?.data || []);
//             setCustomerTotalPages(data.pagination.totalPages);
//             setCustomerPage(pageNum); // ✅ keep track of current page
//         } catch (error) {
//             console.error('Error in Get customer data:', error);
//         }
//     };

//     // Pagination handlers
//     const handleCustomerPrev = () => {
//         if (customerPage > 1) getCustomerData(customerPage - 1);
//     };

//     const handleCustomerNext = () => {
//         if (customerPage < customerTotalPages) getCustomerData(customerPage + 1);
//     };


//     const getProductList = async (cursor = null) => {
//         try {
//             let url = `${backend_Url}/products?limit=${limit}`;
//             if (cursor) url += `&after=${encodeURIComponent(cursor)}`;

//             const response = await fetch(url);
//             const result = await response.json();     

//             if (result?.data) {
//                 setProductList(result.data);
//                 setHasMoreProducts(result.pageInfo.hasNextPage);

//                 if (cursor) {
//                     setCursorStack(prev => [...prev, cursor]); // save current cursor
//                 }
//                 setProductCursor(result.pageInfo.endCursor);
//             }
//         } catch (err) {
//             console.error("Failed to fetch products:", err);
//         }
//     };

//     useEffect(() => {
//         getCustomerData();
//     }, [filter, searchText]);

//     useEffect(() => {
//         if (formVisible) {
//             getProductList();
//         }
//     }, [formVisible]);

//     const deleteCustomerData = async (key, customerId) => {
//         setLoading(true);
//         try {
//             const response = await fetch(`${backend_Url}/delete-customer`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     customerId: key === "all" ? selectedIds : [customerId]
//                 })
//             });

//             const data = await response.json();
//             if (!response.ok) {
//                 toast.error(data.message || 'Delete failed.');
//                 return;
//             }

//             toast.success(data.message || "Customer deleted successfully!");
//         } catch (error) {
//             console.error('Error in delete customer data:', error);
//         } finally {
//             getCustomerData();
//             setLoading(false);
//         }
//     };

//     const handleExport = () => {
//         setFormVisible(true);
//     };

//     const handleFormChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleFormSubmit = async () => {
//         const { email, amount, productIdPrebook, productIdMain } = formData;
//         // if (!email || !amount || !productIdPrebook || !productIdMain) {
//         //     toast.error("Please fill all fields.");
//         //     return;
//         // }

//         try {
//             const response = await fetch(`${backend_Url}/customerdiscount`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, amount, productIdPrebook: PrechekedInput, productIdMain: chekedInput })
//             });

//             const result = await response.json();
//             if (!response.ok) throw new Error(result.message || "Failed to save");

//             toast.success("Customer reward saved successfully!");
//             setFormVisible(false);
//             setFormData({ email: '', amount: '', productIdPrebook: '', productIdMain: '' });
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     const handleSingleCheckbox = (e) => {
//         const { checked, value } = e.target;
//         setSelectedIds(prev =>
//             checked ? [...prev, value] : prev.filter(id => id !== value)
//         );
//     };

//     const handleAllCheckbox = (e) => {
//         const isChecked = e.target.checked;
//         setSelectedIds(isChecked ? customers.map(c => c.customerId) : []);
//     };

//     const [show, setShow] = useState(false);
//     const handleClose = () => {
//         setChekedInput(null);
//         setShow(false);
//     }
//     const handleShow = () => setShow(true);

//     const handleSave = () => {
//         setShow(false)
//     }
//     const [Preshow, PresetShow] = useState(false);
//     const PrehandleClose = () => {
//         setChekedInputPre(null);
//         PresetShow(false);
//     }
//     const PrehandleShow = () => PresetShow(true);
//     const handleSavePre = () => {
//         PresetShow(false)
//     }

//     const [page, setPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [chekedInput, setChekedInput] = useState(null);
//     const [PrechekedInput, setChekedInputPre] = useState(null);
//     // console.log("chekedInput", chekedInput);

//     return (
//         <div className="dashboard-wrapper">
//             {loading && (
//                 <div className="ct-form-loader-main ct-loader-container">
//                     <div className="ct-loader-icon">
//                         <span className="ct-loader-circle"></span>
//                     </div>
//                 </div>
//             )}

//             <div className="dashboard-header">
//                 <h1>Admin Dashboard</h1>
//                 <div className="controls">
//                     {/* <input
//                         type="text"
//                         id="search-box"
//                         placeholder="Search Email..."
//                         onChange={(e) => setSearchText(e.target.value)}
//                     /> */}
//                     {/* <button id="exportBtn" onClick={handleExport}>Admin Data</button> */}
//                     <button className="back-btn" onClick={() => navigate("/login")}>
//                         ⬅ Back
//                     </button>
//                     <button
//                         className="view-btn"
//                         onClick={() => navigate("/admin-data")}
//                     >
//                         Admin Data
//                     </button>
//                     <button id="exportBtn" onClick={handleExport}>Admin Form</button>
//                 </div>
//             </div>

//             {formVisible && (
//                 <div className="export-form" style={{ marginTop: 20 }}>
//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="Enter Email"
//                         value={formData.email}
//                         onChange={handleFormChange}
//                     />

//                     <input
//                         type="number"
//                         name="amount"
//                         placeholder="Enter Amount"
//                         value={formData.amount}
//                         onChange={handleFormChange}
//                     />

//                     <div class="productIdPrebook_modal">
//                         <Button class="w-50" variant="primary" onClick={PrehandleShow}>
//                             Select Prebook Product
//                         </Button>

//                         <Modal show={Preshow} onHide={PrehandleClose}>
//                             <Modal.Header closeButton>
//                                 <Modal.Title>Select Prebook Product</Modal.Title>
//                             </Modal.Header>
//                             <Modal.Body>
//                                 {productList.map(product => (
//                                     <div class="product_modal_item d-flex gap-2 mb-2">
//                                         <input type="radio" name="prebook-product" id={`productIdPrebook_${product.id}`} value={product.id} checked={PrechekedInput == product.id} onChange={(e) => setChekedInputPre(e.target.value)} />
//                                         <label for={`productIdPrebook_${product.id}`}>{product.title}</label>
//                                     </div>
//                                 ))}
//                                 <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
//                                     <button onClick={loadPrevPage} disabled={cursorStack.length === 0}>
//                                         Prev
//                                     </button>
//                                     <span style={{ margin: "0 10px" }}>Page {cursorStack.length + 1}</span>
//                                     <button onClick={loadNextPage} disabled={!hasMoreProducts}>
//                                         Next
//                                     </button>
//                                 </div>


//                             </Modal.Body>
//                             <Modal.Footer>
//                                 <Button class="btn btn-primary" variant="secondary" onClick={PrehandleClose}>
//                                     Close
//                                 </Button>
//                                 <Button class="btn btn-primary" variant="primary" onClick={handleSavePre}>
//                                     Save Changes
//                                 </Button>
//                             </Modal.Footer>
//                         </Modal>
//                     </div>

//                     {/* <select
//                         name="productIdPrebook"
//                         value={formData.productIdPrebook}
//                         onChange={handleFormChange}
//                     >
//                         <option value="">Select Prebook Product</option>
//                         {productList.map(product => (
//                             <option key={product.id} value={product.id}>
//                                 {product.title}
//                             </option>
//                         ))}
//                     </select> */}
//                     <div class="productIdMain_modal">
//                         <Button class="w-50" variant="primary" onClick={handleShow}>
//                             Select Main Product
//                         </Button>

//                         <Modal show={show} onHide={handleClose}>
//                             <Modal.Header closeButton>
//                                 <Modal.Title>Select Main Product</Modal.Title>
//                             </Modal.Header>
//                             <Modal.Body>
//                                 {productList.map(product => (
//                                     <div class="product_modal_item d-flex gap-2 mb-2">
//                                         <input type="radio" name="main-product" id={`productIdMain_${product.id}`} value={product.id} checked={chekedInput == product.id} onChange={(e) => setChekedInput(e.target.value)} />
//                                         <label for={`productIdMain_${product.id}`}>{product.title}</label>
//                                     </div>
//                                 ))}
//                                 <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
//                                     <button onClick={loadPrevPage} disabled={cursorStack.length === 0}>
//                                         Prev
//                                     </button>
//                                     <span style={{ margin: "0 10px" }}>Page {cursorStack.length + 1}</span>
//                                     <button onClick={loadNextPage} disabled={!hasMoreProducts}>
//                                         Next
//                                     </button>
//                                 </div>


//                             </Modal.Body>
//                             <Modal.Footer>
//                                 <Button class="btn btn-primary" variant="secondary" onClick={handleClose}>
//                                     Close
//                                 </Button>
//                                 <Button class="btn btn-primary submitbtn" variant="primary" onClick={handleSave}>
//                                     Save Changes
//                                 </Button>
//                             </Modal.Footer>
//                         </Modal>
//                     </div>
//                     {/* <select
//                         name="productIdMain"
//                         value={formData.productIdMain}
//                         onChange={handleFormChange}
//                     >
//                         <option value="">Select Main Product</option>
//                         {productList.map(product => (
//                             <option key={product.id} value={product.id}>
//                                 {product.title}
//                             </option>
//                         ))}
//                     </select> */}

//                     <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//                         <button onClick={handleFormSubmit}>Submit</button>
//                         <button onClick={() => setFormVisible(false)}>Cancel</button>
//                     </div>

//                 </div>
//             )}




//             <div className="table-container" style={{ marginTop: 80 }}>
//                 <table>
//                     <thead>
//                         <tr>
//                             {/* <th><input type='checkbox' className='checkbox-all' onChange={handleAllCheckbox} /></th> */}
//                             <th>Customer Email</th>
//                             <th>DiscountCode</th>
//                             <th>Created Date</th>
//                             <th>

//                             </th>
//                         </tr>
//                     </thead>
//                     {console.log("customers", customers)}
//                     <tbody>
//                         {customers?.map((customer, i) => (
//                             <tr key={i}>

//                                 <td>{customer.email}</td>
//                                 <td>{customer.discountCode}</td>
//                                 <td>{customer.created}</td>
//                                 {/* <td>
//                                     <button
//                                         className="view-btn"
//                                         onClick={() => navigate("/admin-data")}
//                                     >
//                                         View
//                                     </button>
                                   
//                                 </td> */}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//                 {/* Pagination controls */}
//                 <div style={{ marginTop: "20px", textAlign: "center" }}>
//                     <button onClick={handleCustomerPrev} disabled={customerPage === 1}>
//                         Prev
//                     </button>
//                     <span style={{ margin: "0 10px" }}>
//                         Page {customerPage} of {customerTotalPages}
//                     </span>
//                     <button onClick={handleCustomerNext} disabled={customerPage === customerTotalPages}>
//                         Next
//                     </button>
//                 </div>

//             </div>
//         </div>

//     );
// };

// export default RewardsDashboard;

// // want space between formdata and table



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Badge, Modal, Button } from 'react-bootstrap';

const RewardsDashboard = () => {
    const navigate = useNavigate();
    const backend_Url = "https://prebook-zvko.vercel.app"

    const [customers, setCustomers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        amount: '',
        productIdPrebook: '',
        productIdMain: '',
        discountType: 'product',
        percentage: '',
        discount_method: 'amount'
    });

    const [productList, setProductList] = useState([]);
    const [productCursor, setProductCursor] = useState(null); // current cursor
    const [cursorStack, setCursorStack] = useState([]);       // to track previous cursors for "Prev"
    const [hasMoreProducts, setHasMoreProducts] = useState(true);

    const [customerPage, setCustomerPage] = useState(1);
    const [customerTotalPages, setCustomerTotalPages] = useState(1);
    const limit = 10;

    const loadNextPage = () => {
        if (hasMoreProducts) {
            getProductList(productCursor);
        }
    };

    const loadPrevPage = () => {
        if (cursorStack.length > 1) {
            const newStack = [...cursorStack];
            newStack.pop(); // remove current cursor
            const prevCursor = newStack.pop(); // get previous cursor
            setCursorStack(newStack);
            getProductList(prevCursor);
        } else {
            // First page
            getProductList(null);
            setCursorStack([]);
        }
    };

    const getCustomerData = async (pageNum = customerPage) => {
        try {
            const response = await fetch(`${backend_Url}/data?page=${pageNum}&limit=${limit}`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            if (!response.ok) {
                if (!data.success) {
                    navigate('/login');
                }
                console.error('Login failed:', data.message || 'Unknown error');
                return;
            }

            setCustomers(data?.data || []);
            setCustomerTotalPages(data.pagination.totalPages);
            setCustomerPage(pageNum); // keep track of current page
        } catch (error) {
            console.error('Error in Get customer data:', error);
        }
    };


    // Pagination handlers
    const handleCustomerPrev = () => {
        if (customerPage > 1) getCustomerData(customerPage - 1);
    };

    const handleCustomerNext = () => {
        if (customerPage < customerTotalPages) getCustomerData(customerPage + 1);
    };


    const getProductList = async (cursor = null) => {
        try {
            let url = `${backend_Url}/products?limit=${limit}`;
            if (cursor) url += `&after=${encodeURIComponent(cursor)}`;

            const response = await fetch(url);
            const result = await response.json();

            if (result?.data) {
                setProductList(result.data);
                setHasMoreProducts(result.pageInfo.hasNextPage);

                if (cursor) {
                    setCursorStack(prev => [...prev, cursor]); // save current cursor
                }
                setProductCursor(result.pageInfo.endCursor);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        }
    };

    useEffect(() => {
        getCustomerData();
    }, [filter, searchText]);

    useEffect(() => {
        if (formVisible) {
            getProductList();
        }
    }, [formVisible]);

    const deleteCustomerData = async (key, customerId) => {
        setLoading(true);
        try {
            const response = await fetch(`${backend_Url}/delete-customer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: key === "all" ? selectedIds : [customerId]
                })
            });

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message || 'Delete failed.');
                return;
            }

            toast.success(data.message || "Customer deleted successfully!");
        } catch (error) {
            console.error('Error in delete customer data:', error);
        } finally {
            getCustomerData();
            setLoading(false);
        }
    };

    const handleExport = () => {
        setFormVisible(true);
    };


    const [bxgyShow, setBxgyShow] = useState(false);

    const handleBxgyShow = () => setBxgyShow(true);
    const handleBxgyClose = () => setBxgyShow(false);
    const [bxgyCheckedInput, setBxgyCheckedInput] = useState(""); // selected product


    const handleFormChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "percentage") {
            // convert to number
            let num = parseInt(value, 10);
            if (isNaN(num)) {
                newValue = "";
            } else {
                if (num > 100) num = 100;
                if (num < 1) num = 1;
                newValue = num.toString(); // keep as string for input
            }
        }
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleFormSubmit = async () => {
        const { email, amount, productIdPrebook, productIdMain, discountType, percentage, discount_method } = formData;
        // if (!email || !amount || !productIdPrebook || !productIdMain) {
        //     toast.error("Please fill all fields.");
        //     return;
        // }

        try {
            const response = await fetch(`${backend_Url}/customerdiscount`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, amount, productIdPrebook: PrechekedInput, productIdMain: chekedInput, bxgyId: bxgyCheckedInput, discountType, percentage, discount_method })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to save");

            toast.success("Customer reward saved successfully!");
            setFormVisible(false);
            setFormData({ email: '', amount: '', productIdPrebook: '', productIdMain: '', discountType: '', percentage: '', discount_method: '' });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSingleCheckbox = (e) => {
        const { checked, value } = e.target;
        setSelectedIds(prev =>
            checked ? [...prev, value] : prev.filter(id => id !== value)
        );
    };

    const handleAllCheckbox = (e) => {
        const isChecked = e.target.checked;
        setSelectedIds(isChecked ? customers.map(c => c.customerId) : []);
    };

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setChekedInput(null);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const handleSave = () => {
        setShow(false)
    }
    const [Preshow, PresetShow] = useState(false);
    const PrehandleClose = () => {
        setChekedInputPre(null);
        PresetShow(false);
    }
    const PrehandleShow = () => PresetShow(true);
    const handleSavePre = () => {
        PresetShow(false)
    }

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [chekedInput, setChekedInput] = useState(null);
    const [PrechekedInput, setChekedInputPre] = useState(null);
    // console.log("chekedInput", chekedInput);

    return (
        <div className="dashboard-wrapper">
            {loading && (
                <div className="ct-form-loader-main ct-loader-container">
                    <div className="ct-loader-icon">
                        <span className="ct-loader-circle"></span>
                    </div>
                </div>
            )}

            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <div className="controls">
                    {/* <input
                        type="text"
                        id="search-box"
                        placeholder="Search Email..."
                        onChange={(e) => setSearchText(e.target.value)}
                    /> */}
                    {/* <button id="exportBtn" onClick={handleExport}>Admin Data</button> */}
                    <button className="back-btn" onClick={() => navigate("/login")}>
                        ⬅ Back
                    </button>
                    <button
                        className="view-btn"
                        onClick={() => navigate("/admin-data")}
                    >
                        Admin Data
                    </button>
                    <button id="exportBtn" onClick={handleExport}>Admin Form</button>
                </div>
            </div>
            {/* 
            {formVisible && (
                <div className="export-form" style={{ marginTop: 20 }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleFormChange}
                    />

                    <input
                        type="number"
                        name="amount"
                        placeholder="Enter Amount"
                        value={formData.amount}
                        onChange={handleFormChange}
                    />






                    <div class="productIdPrebook_modal">
                        <Button class="w-50" variant="primary" onClick={PrehandleShow}>
                            Select Prebook Product
                        </Button>

                        <Modal show={Preshow} onHide={PrehandleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Select Prebook Product</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {productList.map(product => (
                                    <div class="product_modal_item d-flex gap-2 mb-2">
                                        <input type="radio" name="prebook-product" id={`productIdPrebook_${product.id}`} value={product.id} checked={PrechekedInput == product.id} onChange={(e) => setChekedInputPre(e.target.value)} />
                                        <label for={`productIdPrebook_${product.id}`}>{product.title}</label>
                                    </div>
                                ))}
                                <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
                                    <button onClick={loadPrevPage} disabled={cursorStack.length === 0}>
                                        Prev
                                    </button>
                                    <span style={{ margin: "0 10px" }}>Page {cursorStack.length + 1}</span>
                                    <button onClick={loadNextPage} disabled={!hasMoreProducts}>
                                        Next
                                    </button>
                                </div>


                            </Modal.Body>
                            <Modal.Footer>
                                <Button class="btn btn-primary" variant="secondary" onClick={PrehandleClose}>
                                    Close
                                </Button>
                                <Button class="btn btn-primary" variant="primary" onClick={handleSavePre}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    {/* <select
                        name="productIdPrebook"
                        value={formData.productIdPrebook}
                        onChange={handleFormChange}
                    >
                        <option value="">Select Prebook Product</option>
                        {productList.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.title}
                            </option>
                        ))}
                    </select> */}
            {/* <div class="productIdMain_modal">
                        <Button class="w-50" variant="primary" onClick={handleShow}>
                            Select Main Product
                        </Button>

                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Select Main Product</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {productList.map(product => (
                                    <div class="product_modal_item d-flex gap-2 mb-2">
                                        <input type="radio" name="main-product" id={`productIdMain_${product.id}`} value={product.id} checked={chekedInput == product.id} onChange={(e) => setChekedInput(e.target.value)} />
                                        <label for={`productIdMain_${product.id}`}>{product.title}</label>
                                    </div>
                                ))}
                                <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
                                    <button onClick={loadPrevPage} disabled={cursorStack.length === 0}>
                                        Prev
                                    </button>
                                    <span style={{ margin: "0 10px" }}>Page {cursorStack.length + 1}</span>
                                    <button onClick={loadNextPage} disabled={!hasMoreProducts}>
                                        Next
                                    </button>
                                </div>


                            </Modal.Body>
                            <Modal.Footer>
                                <Button class="btn btn-primary" variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button class="btn btn-primary submitbtn" variant="primary" onClick={handleSave}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    {/* <select
                        name="productIdMain"
                        value={formData.productIdMain}
                        onChange={handleFormChange}
                    >
                        <option value="">Select Main Product</option>
                        {productList.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.title}
                            </option>
                        ))}
                    </select> */}

            {/* <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        <button onClick={handleFormSubmit}>Submit</button>
                        <button onClick={() => setFormVisible(false)}>Cancel</button>
                    </div>

                </div>
            )} */}

            {formVisible && (
                <div className="export-form" style={{ marginTop: 20 }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleFormChange}
                    />

                    <div class="d-flex">
                        <Button class="w-50" variant="primary" onClick={PrehandleShow}>
                            Select Prebook Product
                        </Button>
                        <Button class="w-50" variant="primary" onClick={handleShow}>
                            Select Main Product
                        </Button>
                    </div>

                    {/* <select
                        name="productIdPrebook"
                        value={formData.productIdPrebook}
                        onChange={handleFormChange}
                    >
                        <option value="">Select Prebook Product</option>
                        {productList.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.title}
                            </option>
                        ))}
                    </select> */}


                    {/* --- DISCOUNT TYPE OPTIONS --- */}
                    <div style={{ marginTop: "15px" }}>
                        <h5>Select Discount Type</h5>

                        {/* Amount of Product */}
                        <div class="d-flex gap-2" style={{ marginBottom: "10px" }}>
                            <input
                                type="radio"
                                id="discount_product"
                                name="discountType"
                                value="product"
                                checked={formData.discountType === "product"}
                                onChange={handleFormChange}
                                style={{ width: "15px" }}
                            />
                            <label htmlFor="discount_product" style={{ marginLeft: "8px", width: "calc(100% - 25px)", cursor: "pointer" }}>
                                Amount of Product
                            </label>
                        </div>

                        {/* Buy X Get Y */}
                        <div class="d-flex gap-2" style={{ marginBottom: "10px" }}>
                            <input
                                type="radio"
                                id="discount_buyxgety"
                                name="discountType"
                                value="buyxgety"
                                checked={formData.discountType === "buyxgety"}
                                onChange={handleFormChange}
                                style={{ width: "15px" }}
                            />
                            <label htmlFor="discount_buyxgety" style={{ marginLeft: "8px", width: "calc(100% - 25px)", cursor: "pointer" }}>
                                Buy X Get Y
                            </label>
                        </div>


                        {/* <div class="d-flex gap-2">
                            <input
                                type="radio"
                                id="discount_order"
                                name="discountType"
                                value="order"
                                checked={formData.discountType === "order"}
                                onChange={handleFormChange}
                                style={{ width: "15px" }}
                            />
                            <label htmlFor="discount_order" style={{ marginLeft: "8px", width: "calc(100% - 25px)" }}>
                                Amount of Order
                            </label>
                        </div> */}
                    </div>

                    {/* --- SHOW EXTRA FIELDS FOR PRODUCT OR ORDER --- */}
                    {(formData.discountType === "product" ||
                        formData.discountType === "order") && (
                            <div className="ct-discount_method_field" style={{ display: "flex", gap: "10px" }}>
                                {/* Discount method selector */}
                                <select
                                    name="discount_method"
                                    value={formData.discount_method}
                                    onChange={handleFormChange}
                                    style={{ marginRight: "10px", width: "calc(50% - 5px)" }}
                                >
                                    <option value="amount">Amount</option>
                                    <option value="percentage">Percentage</option>
                                </select>

                                {/* Dynamic input field */}
                                <input
                                    type="number"
                                    name={formData.discount_method === "percentage" ? "percentage" : "amount"}
                                    placeholder={
                                        formData.discount_method === "percentage"
                                            ? "Enter %"
                                            : "Enter ₹ Amount"
                                    }
                                    value={
                                        formData.discount_method === "percentage"
                                            ? formData.percentage
                                            : formData.amount
                                    }
                                    onChange={handleFormChange}
                                    style={{ width: "calc(50% - 5px)" }}
                                    min={formData.discount_method === "percentage" ? "1" : "0"}
                                    max={formData.discount_method === "percentage" ? "100" : undefined}
                                />
                            </div>
                        )}
                    {formData.discountType === "buyxgety" && (
                        <div style={{ marginTop: "10px" }}>
                            <Button variant="primary" onClick={handleBxgyShow}>
                                Select Product for Get Y
                            </Button>

                            <Modal show={bxgyShow} onHide={handleBxgyClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Select Product</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {productList.map(product => (
                                        <div className="product_modal_item d-flex gap-2 mb-2" key={product.id}>
                                            <input
                                                type="radio"
                                                name="bxgy-product"
                                                id={`productIdBxgy_${product.id}`}
                                                value={product.id}
                                                checked={bxgyCheckedInput == product.id}
                                                onChange={(e) => setBxgyCheckedInput(e.target.value)}
                                            />
                                            <label htmlFor={`productIdBxgy_${product.id}`}>{product.title}</label>
                                        </div>
                                    ))}
                                    {/* Optional: pagination same as main product modal */}
                                    <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
                                        <button onClick={loadPrevPage} disabled={cursorStack.length === 0}>
                                            Prev
                                        </button>
                                        <span style={{ margin: "0 10px" }}>Page {cursorStack.length + 1}</span>
                                        <button onClick={loadNextPage} disabled={!hasMoreProducts}>
                                            Next
                                        </button>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleBxgyClose}>Close</Button>
                                    <Button variant="primary" onClick={() => { handleBxgyClose(); /* handleSave logic here */ }}>
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    )}


                    {/* Buttons */}
                    <div style={{ display: "flex", justifyContent: "end", gap: "10px", marginTop: "20px" }}>
                        <button onClick={handleFormSubmit}>Submit</button>
                        <button onClick={() => setFormVisible(false)}>Cancel</button>
                    </div>
                </div>
            )}


            <div className="table-container" style={{ marginTop: 80 }}>
                <table>
                    <thead>
                        <tr>
                            {/* <th><input type='checkbox' className='checkbox-all' onChange={handleAllCheckbox} /></th> */}
                            <th>Customer Email</th>
                            <th>DiscountCode</th>
                            <th>Created Date</th>
                            <th>Discount status</th>
                        </tr>
                    </thead>
                    {console.log("customers", customers)}
                    <tbody>
                        {customers?.map((customer, i) => (
                            <tr key={i}>
                                <td>{customer.email}</td>
                                <td>{customer.discountCode}</td>
                                <td>{customer.created}</td>
                                <td>{customer.discountApplied ? <Badge bg="success">Applied</Badge> : <Badge bg="secondary">Pending</Badge>}</td>

                                {/* <td>
                                    <button
                                        className="view-btn"
                                        onClick={() => navigate("/admin-data")}
                                    >
                                        View
                                    </button>
                                   
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination controls */}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                        onClick={handleCustomerPrev}
                        disabled={customerPage === 1}
                        style={{
                            backgroundColor: customerPage === 1 ? "#775d6d" : "#775d6d",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "3px 10px",
                            cursor: customerPage === 1 ? "not-allowed" : "pointer",
                            marginRight: "10px",
                        }}
                    >
                        Prev
                    </button>

                    <span style={{ margin: "0 10px", fontWeight: "500", color: "#775d6d" }}>
                        Page {customerPage} of {customerTotalPages}
                    </span>

                    <button
                        onClick={handleCustomerNext}
                        disabled={customerPage === customerTotalPages}
                        style={{
                            backgroundColor:
                                customerPage === customerTotalPages ? "#775d6d" : "#775d6d",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding: "3px 10px",
                            cursor: customerPage === customerTotalPages ? "not-allowed" : "pointer",
                            marginLeft: "10px",
                        }}
                    >
                        Next
                    </button>
                </div>

            </div>

            <Modal show={Preshow} onHide={PrehandleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Prebook Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productList.map(product => (
                        <div class="product_modal_item d-flex gap-2 mb-2">
                            <input type="radio" name="prebook-product" id={`productIdPrebook_${product.id}`} value={product.id} checked={PrechekedInput == product.id} onChange={(e) => setChekedInputPre(e.target.value)} />
                            <label for={`productIdPrebook_${product.id}`}>{product.title}</label>
                        </div>
                    ))}
                    <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
                        <button onClick={loadPrevPage} disabled={cursorStack.length === 0}>
                            Prev
                        </button>
                        <span style={{ margin: "0 10px" }}>Page {cursorStack.length + 1}</span>
                        <button onClick={loadNextPage} disabled={!hasMoreProducts}>
                            Next
                        </button>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button class="btn btn-primary" variant="secondary" onClick={PrehandleClose}>
                        Close
                    </Button>
                    <Button class="btn btn-primary" variant="primary" onClick={handleSavePre}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Main Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productList.map(product => (
                        <div class="product_modal_item d-flex gap-2 mb-2">
                            <input type="radio" name="main-product" id={`productIdMain_${product.id}`} value={product.id} checked={chekedInput == product.id} onChange={(e) => setChekedInput(e.target.value)} />
                            <label for={`productIdMain_${product.id}`}>{product.title}</label>
                        </div>
                    ))}
                    <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
                        <button onClick={loadPrevPage} disabled={cursorStack.length === 0}>
                            Prev
                        </button>
                        <span style={{ margin: "0 10px" }}>Page {cursorStack.length + 1}</span>
                        <button onClick={loadNextPage} disabled={!hasMoreProducts}>
                            Next
                        </button>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    <Button class="btn btn-primary" variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button class="btn btn-primary submitbtn" variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
};

export default RewardsDashboard;

// want space between formdata and table

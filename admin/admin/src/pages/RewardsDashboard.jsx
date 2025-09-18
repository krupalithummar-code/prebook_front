import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const RewardsDashboard = () => {
    const navigate = useNavigate();
    const backend_Url = "http://localhost:8000"

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
        productIdMain: ''
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
            setCustomerPage(pageNum); // ✅ keep track of current page
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

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async () => {
        const { email, amount, productIdPrebook, productIdMain } = formData;
        // if (!email || !amount || !productIdPrebook || !productIdMain) {
        //     toast.error("Please fill all fields.");
        //     return;
        // }

        try {
            const response = await fetch(`${backend_Url}/customerdiscount`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, amount, productIdPrebook: PrechekedInput, productIdMain: chekedInput })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to save");

            toast.success("Customer reward saved successfully!");
            setFormVisible(false);
            setFormData({ email: '', amount: '', productIdPrebook: '', productIdMain: '' });
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
                    <div class="productIdMain_modal">
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

                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
                            <th>

                            </th>
                        </tr>
                    </thead>
                    {console.log("customers", customers)}
                    <tbody>
                        {customers?.map((customer, i) => (
                            <tr key={i}>

                                <td>{customer.email}</td>
                                <td>{customer.discountCode}</td>
                                <td>{customer.created}</td>
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
                    <button onClick={handleCustomerPrev} disabled={customerPage === 1}>
                        Prev
                    </button>
                    <span style={{ margin: "0 10px" }}>
                        Page {customerPage} of {customerTotalPages}
                    </span>
                    <button onClick={handleCustomerNext} disabled={customerPage === customerTotalPages}>
                        Next
                    </button>
                </div>

            </div>
        </div>

    );
};

export default RewardsDashboard;

// want space between formdata and table
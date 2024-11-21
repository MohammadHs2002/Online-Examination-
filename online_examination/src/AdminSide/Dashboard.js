import React from 'react'

const Dashboard = () => {
    return (
        <div className="container-fluid" id="container-wrapper">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
            </div>
            <div className="row mb-3">
                {/* Earnings (Monthly) Card Example */}
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-uppercase mb-1">Earnings (Monthly)</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                                    <div className="mt-2 mb-0 text-muted text-xs">
                                        <span className="text-success mr-2"><i className="fa fa-arrow-up" /> 3.48%</span>
                                        <span>Since last month</span>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-calendar fa-2x text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Earnings (Annual) Card Example */}
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-uppercase mb-1">Sales</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">650</div>
                                    <div className="mt-2 mb-0 text-muted text-xs">
                                        <span className="text-success mr-2"><i className="fas fa-arrow-up" /> 12%</span>
                                        <span>Since last years</span>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-shopping-cart fa-2x text-success" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* New User Card Example */}
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-uppercase mb-1">New User</div>
                                    <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">366</div>
                                    <div className="mt-2 mb-0 text-muted text-xs">
                                        <span className="text-success mr-2"><i className="fas fa-arrow-up" /> 20.4%</span>
                                        <span>Since last month</span>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-users fa-2x text-info" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Pending Requests Card Example */}
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-uppercase mb-1">Pending Requests</div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">18</div>
                                    <div className="mt-2 mb-0 text-muted text-xs">
                                        <span className="text-danger mr-2"><i className="fas fa-arrow-down" /> 1.10%</span>
                                        <span>Since yesterday</span>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-comments fa-2x text-warning" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Area Chart */}
                <div className="col-xl-8 col-lg-7">
                    <div className="card mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Monthly Recap Report</h6>
                            <div className="dropdown no-arrow">
                                <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                    <div className="dropdown-header">Dropdown Header:</div>
                                    <a className="dropdown-item" href="#">Action</a>
                                    <a className="dropdown-item" href="#">Another action</a>
                                    <div className="dropdown-divider" />
                                    <a className="dropdown-item" href="#">Something else here</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart-area">
                                <canvas id="myAreaChart" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Pie Chart */}
                <div className="col-xl-4 col-lg-5">
                    <div className="card mb-4">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Products Sold</h6>
                            <div className="dropdown no-arrow">
                                <a className="dropdown-toggle btn btn-primary btn-sm" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Month <i className="fas fa-chevron-down" />
                                </a>
                                <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                    <div className="dropdown-header">Select Periode</div>
                                    <a className="dropdown-item" href="#">Today</a>
                                    <a className="dropdown-item" href="#">Week</a>
                                    <a className="dropdown-item active" href="#">Month</a>
                                    <a className="dropdown-item" href="#">This Year</a>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <div className="small text-gray-500">Oblong T-Shirt
                                    <div className="small float-right"><b>600 of 800 Items</b></div>
                                </div>
                                <div className="progress" style={{ height: 12 }}>
                                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '80%' }} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="small text-gray-500">Gundam 90'Editions
                                    <div className="small float-right"><b>500 of 800 Items</b></div>
                                </div>
                                <div className="progress" style={{ height: 12 }}>
                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '70%' }} aria-valuenow={70} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="small text-gray-500">Rounded Hat
                                    <div className="small float-right"><b>455 of 800 Items</b></div>
                                </div>
                                <div className="progress" style={{ height: 12 }}>
                                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: '55%' }} aria-valuenow={55} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="small text-gray-500">Indomie Goreng
                                    <div className="small float-right"><b>400 of 800 Items</b></div>
                                </div>
                                <div className="progress" style={{ height: 12 }}>
                                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '50%' }} aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="small text-gray-500">Remote Control Car Racing
                                    <div className="small float-right"><b>200 of 800 Items</b></div>
                                </div>
                                <div className="progress" style={{ height: 12 }}>
                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '30%' }} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-center">
                            <a className="m-0 small text-primary card-link" href="#">View More <i className="fas fa-chevron-right" /></a>
                        </div>
                    </div>
                </div>
                {/* Invoice Example */}
                <div className="col-xl-8 col-lg-7 mb-4">
                    <div className="card">
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-primary">Invoice</h6>
                            <a className="m-0 float-right btn btn-danger btn-sm" href="#">View More <i className="fas fa-chevron-right" /></a>
                        </div>
                        <div className="table-responsive">
                            <table className="table align-items-center table-flush">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Item</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><a href="#">RA0449</a></td>
                                        <td>Udin Wayang</td>
                                        <td>Nasi Padang</td>
                                        <td><span className="badge badge-success">Delivered</span></td>
                                        <td><a href="#" className="btn btn-sm btn-primary">Detail</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="#">RA5324</a></td>
                                        <td>Jaenab Bajigur</td>
                                        <td>Gundam 90' Edition</td>
                                        <td><span className="badge badge-warning">Shipping</span></td>
                                        <td><a href="#" className="btn btn-sm btn-primary">Detail</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="#">RA8568</a></td>
                                        <td>Rivat Mahesa</td>
                                        <td>Oblong T-Shirt</td>
                                        <td><span className="badge badge-danger">Pending</span></td>
                                        <td><a href="#" className="btn btn-sm btn-primary">Detail</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="#">RA1453</a></td>
                                        <td>Indri Junanda</td>
                                        <td>Hat Rounded</td>
                                        <td><span className="badge badge-info">Processing</span></td>
                                        <td><a href="#" className="btn btn-sm btn-primary">Detail</a></td>
                                    </tr>
                                    <tr>
                                        <td><a href="#">RA1998</a></td>
                                        <td>Udin Cilok</td>
                                        <td>Baby Powder</td>
                                        <td><span className="badge badge-success">Delivered</span></td>
                                        <td><a href="#" className="btn btn-sm btn-primary">Detail</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer" />
                    </div>
                </div>
                {/* Message From Customer*/}
                <div className="col-xl-4 col-lg-5 ">
                    <div className="card">
                        <div className="card-header py-4 bg-primary d-flex flex-row align-items-center justify-content-between">
                            <h6 className="m-0 font-weight-bold text-light">Message From Customer</h6>
                        </div>
                        <div>
                            <div className="customer-message align-items-center">
                                <a className="font-weight-bold" href="#">
                                    <div className="text-truncate message-title">Hi there! I am wondering if you can help me with a
                                        problem I've been having.</div>
                                    <div className="small text-gray-500 message-time font-weight-bold">Udin Cilok · 58m</div>
                                </a>
                            </div>
                            <div className="customer-message align-items-center">
                                <a href="#">
                                    <div className="text-truncate message-title">But I must explain to you how all this mistaken idea
                                    </div>
                                    <div className="small text-gray-500 message-time">Nana Haminah · 58m</div>
                                </a>
                            </div>
                            <div className="customer-message align-items-center">
                                <a className="font-weight-bold" href="#">
                                    <div className="text-truncate message-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                    </div>
                                    <div className="small text-gray-500 message-time font-weight-bold">Jajang Cincau · 25m</div>
                                </a>
                            </div>
                            <div className="customer-message align-items-center">
                                <a className="font-weight-bold" href="#">
                                    <div className="text-truncate message-title">At vero eos et accusamus et iusto odio dignissimos
                                        ducimus qui blanditiis
                                    </div>
                                    <div className="small text-gray-500 message-time font-weight-bold">Udin Wayang · 54m</div>
                                </a>
                            </div>
                            <div className="card-footer text-center">
                                <a className="m-0 small text-primary card-link" href="#">View More <i className="fas fa-chevron-right" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Logout */}
            <div className="modal fade" id="logoutModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabelLogout" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabelLogout">Ohh No!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to logout?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-primary" data-dismiss="modal">Cancel</button>
                            <a href="login.html" className="btn btn-primary">Logout</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
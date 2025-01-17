import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import NotFound from '../components/NotFound';
import { baseUrl } from '../shared';
import { LoginContext } from '../App';

export default function Customer() {
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState();
    const [tempCustomer, setTempCustomer] = useState();
    const [notFound, setNotFound] = useState();
    const [changed, setChanged] = useState(false);
    const [error, setError] = useState();

    const location = useLocation();

    useEffect(() => {
        if (!customer) return;
        if (!customer) return;

        let equal = true;
        if (customer.name !== tempCustomer.name) equal = false;
        if (customer.industry !== tempCustomer.industry) equal = false;

        if (equal) setChanged(false);
    });

    useEffect(() => {
        const url = baseUrl + 'api/customers/' + id;
        fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access'),
            },
        })
            .then((response) => {
                if (response.status === 404) {
                    //render a 404 component in this page
                    setNotFound(true);
                } else if (response.status === 401) {
                    setLoggedIn(false);
                    navigate('/login', {
                        state: {
                            previousUrl: location.pathname,
                        },
                    });
                }

                if (!response.ok) {
                    throw new Error('Something went wrong, try again later');
                }

                return response.json();
            })
            .then((data) => {
                setCustomer(data.customer);
                setTempCustomer(data.customer);
                setError(undefined);
            })
            .catch((e) => {
                setError(e.message);
            });
    }, []);

    function updateCustomer(e) {
        e.preventDefault();
        const url = baseUrl + 'api/customers/' + id;
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('access'),
            },
            body: JSON.stringify(tempCustomer),
        })
            .then((response) => {
                if (response.status === 401) {
                    setLoggedIn(false);
                    navigate('/login', {
                        state: {
                            previousUrl: location.pathname,
                        },
                    });
                }
                if (!response.ok) throw new Error('something went wrong');
                return response.json();
            })
            .then((data) => {
                setCustomer(data.customer);
                setChanged(false);
                setError(undefined);
            })
            .catch((e) => {
                setError(e.message);
            });
    }

    return (
        <div class="p-3">
            {notFound ? <p>The customer with id {id} was not found</p> : null}

            {customer ? (
                <div>
                    <form
                        className="w-full max-w-sm"
                        id="customer"
                        onSubmit={updateCustomer}
                    >
                        <div className="mb-6 md:flex md:items-center">
                            <div className="md:w-1/4">
                                <label for="name">Name</label>
                            </div>

                            <div className="md:w-3/4">
                                <input
                                    className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="name"
                                    type="text"
                                    value={tempCustomer.name}
                                    onChange={(e) => {
                                        setChanged(true);
                                        setTempCustomer({
                                            ...tempCustomer,
                                            name: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mb-6 md:flex md:items-center">
                            <div className="md:w-1/4">
                                <label for="industry">Industry</label>
                            </div>

                            <div className="md:w-3/4">
                                <input
                                    id="industry"
                                    className="w-full px-4 py-2 leading-tight text-gray-700 bg-gray-200 border-2 border-gray-200 rounded appearance-none focus:outline-none focus:bg-white focus:border-purple-500"
                                    type="text"
                                    value={tempCustomer.industry}
                                    onChange={(e) => {
                                        setChanged(true);
                                        setTempCustomer({
                                            ...tempCustomer,
                                            industry: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                    {changed ? (
                        <div className="mb-2">
                            <button
                                className="px-4 py-2 mr-2 font-bold text-white rounded bg-slate-400 hover:bg-slate-500"
                                onClick={(e) => {
                                    setTempCustomer({ ...customer });
                                    setChanged(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                form="customer"
                                className="px-4 py-2 font-bold text-white bg-purple-600 rounded hover:bg-purple-700"
                            >
                                Save
                            </button>
                        </div>
                    ) : null}

                    <div>
                        <button
                            className="px-4 py-2 font-bold text-white rounded bg-slate-800 hover:bg-slate-500"
                            onClick={(e) => {
                                const url = baseUrl + 'api/customers/' + id;
                                fetch(url, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization:
                                            'Bearer ' +
                                            localStorage.getItem('access'),
                                    },
                                })
                                    .then((response) => {
                                        if (response.status === 401) {
                                            setLoggedIn(false);
                                            navigate('/login', {
                                                state: {
                                                    previousUrl:
                                                        location.pathname,
                                                },
                                            });
                                        }
                                        if (!response.ok) {
                                            throw new Error(
                                                'Something went wrong'
                                            );
                                        }
                                        navigate('/customers');
                                    })
                                    .catch((e) => {
                                        setError(e.message);
                                    });
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ) : null}

            {error ? <p>{error}</p> : null}
            <br />
            <Link to="/customers">
                <button className="px-4 py-2 font-bold text-white no-underline bg-purple-600 rounded hover:bg-purple-700">
                    ← Go back
                </button>
            </Link>
        </div>
    );
}

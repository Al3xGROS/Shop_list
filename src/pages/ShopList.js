import React, { useState, useEffect } from 'react';

function ShopList() {

    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState("");
    const [id, setId] = useState("");
    const [seq, setSeq] = useState("");
    const [list, setList] = useState([]);
    const [registerServ, setRegisterServ] = useState("");
    const [coursesServ, setCoursesServ] = useState("");

    useEffect(() => {
        let apiId = window.localStorage.getItem('apiId');
        let apiList = window.localStorage.getItem('apiList');
        let apiSeq = window.localStorage.getItem('apiSeq');
        let localList = window.localStorage.getItem('localList');
        let localId = window.localStorage.getItem('localId');
        let register = window.localStorage.getItem('registerServ');
        let courses = window.localStorage.getItem('coursesServ');
        if ((localId !== null && localId !== "") && localId !== apiId) {
            setId(JSON.parse(localId));
        }
        else {
            setId(JSON.parse(apiId));
        }
        if ((localList === null || localList.length === 0)) {
            setList(JSON.parse(apiList));
        }
        else {
            setList(JSON.parse(localList));
        }
        setSeq(JSON.parse(apiSeq));
        setRegisterServ(JSON.parse(register));
        setCoursesServ(JSON.parse(courses));
    }, []);

    useEffect(() => {
        setTimeout(() => {
            window.localStorage.setItem('localList', JSON.stringify(list));
            window.localStorage.setItem('localId', JSON.stringify(id));
        }, 500);
    }, [list, id]);

    const handleAdd = (event) => {
        event.preventDefault();
        if (product && quantity) {
            let exists = false;
            let updatedList = list.map(item => {
                if (item.produit === product) {
                    exists = true;
                    return {
                        produit: product,
                        qte: parseInt(item.qte) + parseInt(quantity)
                    };
                }
                return item;
            });
    
            if (!exists) {
                updatedList.push({ produit: product, qte: quantity });
            }
    
            setList(updatedList);
            setProduct("");
            setQuantity("");
        }
    };

    const updateQuantity = (index, newQuantity) => {
        const updatedList = [...list];
        updatedList[index].qte = newQuantity;
        setList(updatedList);
    }

    const handleDelete = (index) => {
        setList(list.filter((item, i) => i !== index));
    };

    const synchro = () => {
        // Create the chg array with the difference between apiList and localList
        let apiList = JSON.parse(window.localStorage.getItem('apiList'));
        let localList = JSON.parse(window.localStorage.getItem('localList'));
    
        let chg = [];
        for (let i = 0; i < localList.length; i++) {
            let found = false;
            for (let j = 0; j < apiList.length; j++) {
                if ((localList[i].produit).toLowerCase() === (apiList[j].produit).toLowerCase()) {
                    chg.push({ produit: localList[i].produit, qte: (localList[i].qte - apiList[j].qte).toString()});
                    found = true;
                    break;
                }
            }
            if (!found) {
                chg.push({ produit: localList[i].produit, qte: (localList[i].qte).toString() });
            }
        }
    
        for (let i = 0; i < apiList.length; i++) {
            let found = false;
            for (let j = 0; j < localList.length; j++) {
                if ((apiList[i].produit).toLowerCase() === (localList[j].produit).toLowerCase()) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                chg.push({ produit: apiList[i].produit, qte: (-apiList[i].qte).toString() });
            }
        }

        refreshApi();

        post(chg);

        refreshApi();

        alert("Synchronisation done! GG player!");
    };

    const post = async (chg) => {
        console.log(chg);
        try {
            const response = await fetch(coursesServ, {
                method: 'POST',
		        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		        body: 'id=' + id + '&chg=' + JSON.stringify(Object.values(chg))
            });
            if (response.ok) {
                console.log('Modifications transmitted successfully');
                console.log('id=' + id + '&chg=' + JSON.stringify(Object.values(chg)));
            } else {
                console.error('There was a problem with the input parameters');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const refreshApi = () => {
        fetch(registerServ)
            .then(response => response.json())
            .then(data => {
                window.localStorage.setItem('apiId', JSON.stringify(data.id));
                window.localStorage.setItem('apiList', JSON.stringify(Object.values(data.courses)));
                window.localStorage.setItem('apiSeq', JSON.stringify(data.sequence));
            });
    }

    const updateList = () => {
        refreshApi();
        let apiList = JSON.parse(window.localStorage.getItem('apiList'));
        setList(apiList);

        alert("List updated! Note that if there is no changes it means you already are up to date!");
    }

    const getBack = () => {
        window.location.href = "/";
    }


    return (
        <div className="page">
            <div className="page_form_2">
                <div className="form_header">
                    <h3>Customize the List</h3>
                </div>
                <div className="form_inputs">
                    <label>Product</label>
                    <input type="text" id="product" name="product" placeholder="🥖  Type the product name" value={product} onChange={(event) => setProduct(event.target.value)} required />
                    <label>Quantity</label>
                    <input type="text" id="quantity" name="quantity" placeholder="📒  Type the quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
                </div>
                <button title="Add a new product to the list. The product must have a name and a quantity!" className="form_button_1" onClick={handleAdd}>ADD PRODUCT</button>
                <button title="Send your modified list to the server. Your changes matter!" className="form_button_2" onClick={synchro}>SYNCHRO LIST</button>
                <button title="Load the server's list. You now have the same list as everyone else!" className="form_button_2" onClick={updateList}>GET SERVER LIST</button>
                <button title="Get back to the login. A new fresh start!" className="form_button_3" onClick={getBack}>BACK TO LOGIN</button>
            </div>
            <div className="page_form_2">
                <div className="form_header">
                    <h3>The List</h3>
                    <p>
                        You can update a quantity by clicking on it. <br/>
                        And delete a product by clicking on it.
                    </p>
                </div>
                <table className="table_list">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                    {list.map((item, index) => {
                        if (item.qte !== "0") {
                            return (
                                <tr key={index}>
                                    <td onClick={() => handleDelete(index)}>
                                        {item.produit}
                                    </td>
                                    <td onClick={() => updateQuantity(index, prompt("Enter new quantity"))}>
                                        {item.qte}
                                    </td>
                                </tr>
                            );
                        }
                            return null;
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ShopList;


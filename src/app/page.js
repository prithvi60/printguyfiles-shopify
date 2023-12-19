"use client"
import { useEffect, useState } from "react";
import {
  ListObjectsCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import {getAllOrders} from "../../lib/action"
function App() {
  const [objects, setObjects] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const client = new S3Client({
      region: "ap-south-1",
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "eu-north-1" },
        identityPoolId: "eu-north-1:6882a53f-ea7c-49cb-b0b6-bea5052ec264",
      }),
    });
    const command = new ListObjectsCommand({
      Bucket: "theprintguy-customerfiles",
      ExpectedBucketOwner: "200994887321",
    });
    client.send(command).then(({ Contents }) => setObjects(Contents || []));
  }, []);
//   // Get orders
  useEffect(() => {
    async function fetchOrders() {
      const order = await getAllOrders();
      console.log("order fecth ", order);
      setOrders(order.orders);
    }
    fetchOrders();
  }, []);
  useEffect(() => {
    console.log("order data", orders);
  }, [orders]);
  if(!orders){
    return <div>Loading...</div>
  }

  const orderedfiles=objects.filter((obj)=> orders.find((a)=>obj.Key.split("-")[0].toLowerCase() === a.billing_address.first_name)).map((item)=>{
    const order=orders[0].name
  return [{orderid:order},item]
  })
  console.log("manipulation",orderedfiles)
  return (
    <div className="App">
      <h2 style={{textAlign:"center"}}>Design Files from Customers</h2>
      <table id="tableContainer">
        <thead>
          <tr>
          <th>Order ID</th>
          <th>Customer Name</th>
          {/* <th>Contact Info</th> */}
            <th>Product Name</th>
            <th>Configuration</th>
            <th>Upload Date</th>
            <th>File Size</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orderedfiles.sort((a, b) => {
            // @ts-ignore
  return new Date(b[1].LastModified).getTime() - new Date(a[1].LastModified).getTime();
}).map((o,idx) => {
            // Split the date string into an array of strings, using whitespace as the delimiter.
            const dateParts = String(o[1].LastModified).split(/\s+/);
            const specs= o[1].Key?.split("Specs:")[1]?.split(".")[0]?.split(",")
            // console.log("data",specs)

            // Get the day, month, and year from the date parts.
            const day = dateParts[2];
            const month = dateParts[1];
            const year = dateParts[3];
            // get customemr info
            const id=o[1].Key?.split("-")[0] || ""
          // const customer=await getCustomerInfo(id);
            return (
              <tr key={`${o[1].ETag}+${idx}`}>
                 <td style={{textAlign:"center"}}>{o[0].orderid}</td>
                <td style={{fontWeight:"bold",maxWidth:"200px",textAlign:"center"}}>{o[1].Key?.split("-")[0]}</td>
                {/* <td>{o.Key}</td> */}
                <td style={{fontSize:"small",textAlign:"center"}}>{o[1].Key?.split("-")[1]?.split(".")[0]}</td>
                <td>{specs?.map((item,idx)=><li className={"specs"} key={idx}>{item.split("-")[0]} - <span style={{fontWeight:"bold"}}>{item.split("-")[1]}</span></li>)}</td>
                <td  style={{textAlign:"center"}}>{`${day} ${month} ${year}`}</td>
                <td style={{textAlign:"center"}}>{(Number(o[1].Size)/(1024 * 1024)).toFixed(3)}Mb</td>
                <td>
                  <a
                    target="blank"
                    href={`https://theprintguy-customerfiles.s3.ap-south-1.amazonaws.com/${o[1].Key}`}
                  >
                    <button>Download</button>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
        {/* <tbody>
          {objects.sort((a, b) => {
            // @ts-ignore
  return new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime();
}).map((o,idx) => {
            // Split the date string into an array of strings, using whitespace as the delimiter.
            const dateParts = String(o.LastModified).split(/\s+/);
            const specs= o.Key?.split("Specs:")[1]?.split(".")[0]?.split(",")
            // console.log("data",specs)

            // Get the day, month, and year from the date parts.
            const day = dateParts[2];
            const month = dateParts[1];
            const year = dateParts[3];
            // get customemr info
            const id=o.Key?.split("-")[0] || ""
          // const customer=await getCustomerInfo(id);
            return (
              <tr key={`${o.ETag}+${idx}`}>
                 <td style={{textAlign:"center"}}>#1000</td>
                <td style={{fontWeight:"bold",maxWidth:"200px",textAlign:"center"}}>{o.Key?.split("-")[0]}</td>
               
                <td style={{fontSize:"small",textAlign:"center"}}>{o.Key?.split("-")[1]?.split(".")[0]}</td>
                <td>{specs?.map((item,idx)=><li className={"specs"} key={idx}>{item.split("-")[0]} - <span style={{fontWeight:"bold"}}>{item.split("-")[1]}</span></li>)}</td>
                <td  style={{textAlign:"center"}}>{`${day} ${month} ${year}`}</td>
                <td style={{textAlign:"center"}}>{(Number(o.Size)/(1024 * 1024)).toFixed(3)}Mb</td>
                <td>
                  <a
                    target="blank"
                    href={`https://theprintguy-customerfiles.s3.ap-south-1.amazonaws.com/${o.Key}`}
                  >
                    <button>Download</button>
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody> */}
      </table>
    </div>
  );
}

export default App;
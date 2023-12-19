      
        'use server';
        export const getAllOrders = async () => {
          try {
          const res=  await GetAllOrders();
          console.log(res)
            return res
          } catch (e) {
            return 'Error getting orders';
          }
        }; 

        const GetAllOrders = async () => {
            // console.log("test price deets",id)
            const username = process.env.SHOPIFY_REST_USERNAME;
            const password=process.env.SHOPIFY_REST_PASS;
            const response = await fetch(`https://2f8923-2.myshopify.com/admin/api/2023-10/orders.json?status=any`, {
              method: "GET",
              headers: {
                "Authorization": `Basic ${btoa(username + ":" + password)}`,
                },
            });
          
            if (response.status === 200) {
              // GET request was successful
              // console.log("GET request was successful!", );
              return response.json()
            } else {
              // GET request failed
              console.log("GET request failed!",response.statusText);
            }
          };
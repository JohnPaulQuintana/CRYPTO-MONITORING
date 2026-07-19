import {
    useEffect,
    useState
} from "react";


import {
    getTrends
} from "../api/priceApi";


import type {
    Trends
} from "../types/trend";



export function useTrends(){

    const [trends,setTrends] =
        useState<Trends>({});


    const [loading,setLoading] =
        useState(true);



    useEffect(()=>{


        async function load(){

            try{

                const data =
                    await getTrends();


                setTrends(data);


            }
            finally{

                setLoading(false);

            }

        }


        load();


    },[]);



    return {
        trends,
        loading
    };

}
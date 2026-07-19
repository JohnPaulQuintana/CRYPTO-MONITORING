import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig({

    plugins:[
        react()
    ],


    server:{
        host: true,

        allowedHosts: [
            "couples-traffic-promote-seek.trycloudflare.com"
        ],
        proxy:{

            "/api":{

                // target:"http://localhost:8002",
                target:"https://crypto-monitoring-ajh4.onrender.com/",

                changeOrigin:true,

                secure:false

            }

        }

    }

});
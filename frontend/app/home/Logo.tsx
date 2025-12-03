import React from 'react';
import Link from "next/link";
import {Sparkles} from "lucide-react";
import {motion} from "framer-motion";

const Logo = () => {
    return (
       <Link href="/">
           <motion.div
               className="flex items-center space-x-2"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
           >
               <Sparkles className="h-6 w-6 text-primary" />
               <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                   Recruitsss
               </div>
           </motion.div>
       </Link>
    );
};

export default Logo;
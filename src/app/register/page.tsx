"use client";

import React , { useState , useEffect}from 'react'
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword , sendEmailVerification } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
function RegisterPage() {
  return (
    <div>RegisterPage</div>
  )
}

export default RegisterPage
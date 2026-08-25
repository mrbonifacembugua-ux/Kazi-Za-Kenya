import { Suspense } from 'react';
import MessageClient from './MessageClient';

export default function Messages(){
  return <Suspense fallback={<main style={{padding:40,fontFamily:'Arial'}}>Loading messages…</main>}><MessageClient/></Suspense>;
}

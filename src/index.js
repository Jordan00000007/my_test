/*eslint-disable*/
import '@fortawesome/fontawesome-free/css/all.min.css';



(function IIFE() {

  const doc = document;
  const div = doc.createElement('div');
  div.id = 'root';
  //div.style = `min-height:101%;overflow: scroll; -webkit-overflow-scrolling: touch; `;

  doc.body.appendChild(div);


  // let lockAudioSource = doc.createElement('source')
  // lockAudioSource.src = lockVoice;
  // doc.querySelector('#lockAudio').appendChild(lockAudioSource)

  // let unLockAudioSource = doc.createElement('source')
  // unLockAudioSource.src = unLockVoice;
  // doc.querySelector('#unLockAudio').appendChild(unLockAudioSource)

  //doc.querySelector('#webTitle').innerHTML=getTerms('WebTitle');
  doc.querySelector('#webTitle').innerHTML='B-FRESH';

  import(/* webpackChunkName: "router" */ './js/router.js').then((module) => {
    module.default();
  });
}());
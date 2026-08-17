(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.EngineeringCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function identify(diameter,rawPitch,mode,data){
    const pitch=mode==='tpi'?25.4/rawPitch:rawPitch;
    return data.map(t=>{
      const diameterDelta=Math.abs(t.diameter-diameter);
      const pitchDelta=Math.abs(t.pitch-pitch);
      const score=Math.max(0,100-(diameterDelta/Math.max(.15,diameter*.015))*35-(pitchDelta/Math.max(.04,pitch*.07))*45);
      return {...t,diameterDelta,pitchDelta,score};
    }).filter(t=>t.score>5).sort((a,b)=>b.score-a.score).slice(0,5);
  }
  function tapDrill(diameter,pitch,engagement=75,type='cut'){
    const safeEngagement=Math.min(90,Math.max(50,engagement));
    const hole=type==='cut'?diameter-pitch*(safeEngagement/75):diameter-pitch*(safeEngagement/150);
    return {hole,nearestTenth:Math.round(hole*10)/10,engagement:safeEngagement};
  }
  function metricProfile(diameter,pitch){
    return {H:.8660254*pitch,d2:diameter-.649519*pitch,d3:diameter-1.226869*pitch,D1:diameter-1.082532*pitch,radialDepth:.613435*pitch};
  }
  function cone(D,d,L){const half=Math.atan((D-d)/(2*L))*180/Math.PI;return {half,full:half*2,ratio:2*L/(D-d),radialDifference:(D-d)/2}}
  function hex(acrossFlats){const acrossCorners=acrossFlats/Math.cos(Math.PI/6),side=acrossFlats/Math.sqrt(3);return {acrossCorners,side,area:Math.sqrt(3)*1.5*side*side}}
  function rotate(x,y,degrees){const r=degrees*Math.PI/180;return {x:x*Math.cos(r)-y*Math.sin(r),y:x*Math.sin(r)+y*Math.cos(r),radius:Math.hypot(x,y)}}
  return {identify,tapDrill,metricProfile,cone,hex,rotate};
});

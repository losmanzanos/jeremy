(function(){
  var b=document.getElementById('bgr'), s=document.getElementById('sheet');
  b.addEventListener('click',function(){
    var on=s.classList.toggle('on');
    b.classList.toggle('on',on);
    b.setAttribute('aria-expanded',on?'true':'false');
    document.body.style.overflow=on?'hidden':'';
  });
  s.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){
    s.classList.remove('on');b.classList.remove('on');document.body.style.overflow='';
  });});

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* survey plate: crosshair with a live coordinate readout.
     the plate frames lon -107.383..-105.106, lat 39.83..37.97 */
  var plate = document.getElementById('plate'),
      xh = document.getElementById('xh'),
      read = document.getElementById('read');
  if(plate && xh && read){
    var L0=-107.383, L1=-105.106, T0=39.83, T1=37.97;
    var vx=xh.querySelector('.vx'), hz=xh.querySelector('.hz'), dot=xh.querySelector('b');
    plate.addEventListener('mousemove', function(e){
      var r = plate.getBoundingClientRect();
      var px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
      px = Math.min(1,Math.max(0,px)); py = Math.min(1,Math.max(0,py));
      vx.style.left = (px*100)+'%'; hz.style.top = (py*100)+'%';
      dot.style.left = (px*100)+'%'; dot.style.top = (py*100)+'%';
      var lon = L0 + px*(L1-L0), lat = T0 + py*(T1-T0);
      read.innerHTML = lat.toFixed(2)+'&deg; N &middot; '+Math.abs(lon).toFixed(2)+'&deg; W';
    });
    plate.addEventListener('mouseleave', function(){
      read.innerHTML = '39.10&deg; N &middot; 106.45&deg; W';
    });
  }

  /* contours drift a little against the scroll */
  if(!reduce){
    var drifters = [].slice.call(document.querySelectorAll('.topo-why,.topo-end'));
    var ticking = false;
    function drift(){
      drifters.forEach(function(el){
        var r = el.parentElement.getBoundingClientRect();
        var p = (r.top + r.height/2 - window.innerHeight/2) / window.innerHeight;
        el.style.setProperty('--dy', (p * -26).toFixed(1)+'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ ticking = true; requestAnimationFrame(drift); }
    }, {passive:true});
    drift();
  }

  /* only one question open at a time */
  var qs = [].slice.call(document.querySelectorAll('.faq details'));
  qs.forEach(function(d){
    d.addEventListener('toggle', function(){
      if(d.open) qs.forEach(function(o){ if(o!==d) o.open=false; });
    });
  });

  /* demo form */
  var form = document.getElementById('contactForm');
  if(form) form.addEventListener('submit', function(e){
    e.preventDefault();
    form.querySelectorAll('.fld, button, .form-note').forEach(function(n){ n.style.display='none'; });
    document.getElementById('sent').style.display='block';
  });
})();
import { AfterViewInit, Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import functionPlot from 'function-plot';
import Desmos from 'desmos';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  sources=[
    "[1] E. N. Foote, “The American Journal of Science.,” vol. 22, 1856, Accessed: Mar. 27, 2021. [Online]. Available: http://archive.org/details/mobot31753002152491.",
    "[2] I. Hilton, “The reality of global warming: Catastrophies dimly seen,” World Policy Journal, vol. 25, no. 1, pp. 1–8, 2008.",
    "[3] W. D. Nordhaus, “To slow or not to slow: the economics of the greenhouse effect,” The Economic Journal, vol. 101, no. 407, pp. 920–937, 1991, doi: 10.2307/2233864.",
    "Ritchie, H., &amp; Roser, M. (2020). CO₂ and Greenhouse Gas Emissions. Our World in Data. doi:https://ourworldindata.org/co2-and-other-greenhouse-gas-emissions"
  ]
  eqn_one = "Ṫ(t) = α{μM(t) – T(t)}";
  eqn_one_simp = "Ṫ(t) = α{g[M(t)] – T(t)}";
  beta:number = 0.5;
  delta:number = 0.005;
  E:number = 100;
  mu = 4*10^-5;
  alpha = 0.02;
  ct_ltk = "C_t";
  cm_ltk = "C_m";
  c=(8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
  c_t = Math.E**(1985*this.alpha)*(0.3-this.mu*this.beta*this.E/this.delta) + (this.alpha*this.mu*this.c*Math.E**(1985*(this.alpha-this.delta)))/(this.alpha-this.delta);
  // c=(8000 - (this.beta*this.E));
  m_str:string=`${(this.beta*this.E)/(this.delta)} + ${(this.c)}*(e^{-${(this.delta)}*x})`
  // second_equation = `${this.alpha*this.mu}*(e^(${this.alpha}*x)*${(this.beta*this.E)/(this.delta*this.alpha)}) + ${this.c}*e^(x*${((this.alpha-this.delta))/(this.alpha-this.delta)}) + ${this.c_t})/e^${(this.alpha)}*t`;
  second_equation = `(${this.toFixed(this.alpha*this.mu)})*(e^{(${this.alpha}*x)}*${(this.beta*this.E)})/${(this.delta*this.alpha)} + ${this.c}*e^{(x*${((this.alpha-this.delta))})}/(${(this.alpha-this.delta)}) + ${this.c_t})/(e^{${(this.alpha)}*x)}`;

  showNavigationArrows = false;
  showNavigationIndicators = false;
  // images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);
  images = [
    "https://freesvg.org/img/globe_america_simple.png",
    // "https://image.freepik.com/free-photo/planet-earth-space_56345-193.jpg",
    // "https://image.freepik.com/free-vector/air-pollution-with-different-molecules_1308-34481.jpg",
    "https://freesvg.org/img/GlobalWarming-fire.png",
    "https://freesvg.org/img/Anonymous_Factory.png"
  ]
  elem :HTMLElement = document.querySelector(".graph-class");
  options = {title:"",target:"",width:700,height:500,grid:true, xAxis:{
    label: 'x - axis',
    domain: [-10, 10]
  },yAxis:{
    label: 'y - axis',
    domain: [1, 6]
  },data : [{
    fn:  'x^2',
      // derivative:{
      //   fn:'2x',
      //   updateOnMouseMove:true
      // }
  }]};
  o_eqn_M_t = "M(t) = βE/δ + C*exp(-δt)";
  o_eqn_T_t = `T\\left(t\\right)\\ =\\frac{αμ\\left(\\frac{βE}{δα}e^{αt}+\\frac{C_{M}}{α-δ}e^{t\\left(α-δ\\right)}+C_{T}\\right)}{e^{αt}}`;
  calculator;
  calculator_second;
  elements;
  windowHeight;
  code_loc = "https://firebasestorage.googleapis.com/v0/b/team-nii.appspot.com/o/Project_ode45_final.m?alt=media&token=c7f491c6-930b-4c65-bf62-c589bb8d66e0";
  pdf_loc = "https://firebasestorage.googleapis.com/v0/b/team-nii.appspot.com/o/Project_ode45_final.pdf?alt=media&token=fc2f3cee-efcb-4f2e-9ddd-2f7bfa4c09f6";
  analyt_loc = "https://firebasestorage.googleapis.com/v0/b/team-nii.appspot.com/o/Analytical%20solutions%20for%20M(t)%20and%20T(t).pdf?alt=media&token=b047f2c1-fc3b-4f16-8bc6-ae9afbbedc13";
  video_loc = "https://firebasestorage.googleapis.com/v0/b/team-nii.appspot.com/o/TeamNiiProjectVideo_edited.mp4?alt=media&token=93120cd2-e84c-4222-b9ca-a18f969f1e6e";
  code_filename = "Team_Nii_code";
  pdf_filename = "Team_Nii_pub";
  code_file_url;
  pdf_file_url;

  

  @ViewChild('#graph') graph:HTMLElement;

  
  constructor(private sanitizer: DomSanitizer) {}

  init() {
    this.elements = document.querySelectorAll('.hidden');
    this.windowHeight = window.innerHeight;
  }


  toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
  }

  checkPosition(ev) {
    for (var i = 0; i < this.elements.length; i++) {
      var element = this.elements[i];
      var positionFromTop = this.elements[i].getBoundingClientRect().top;

      if (positionFromTop - this.windowHeight <= 0) {
        element.classList.add('fade-in-element');
        element.classList.remove('hidden');
      }
    }
  }


  updateBeta($event){
    this.beta = $event.value;
    this.c = (8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
    this.c_t = Math.E**(1985*this.alpha)*(0.3-this.mu*this.beta*this.E/this.delta) + (this.alpha*this.mu*this.c*Math.E**(1985*(this.alpha-this.delta)))/(this.alpha-this.delta);
    this.m_str=`f(x) = ${(this.beta*this.E)/(this.delta)} + ${(this.c)}*e^{(-${(this.delta)}*x)}`
    this.second_equation = `f(x) = (${this.toFixed(this.alpha*this.mu)})*(e^{(${this.alpha}*x)}*${(this.beta*this.E)/(this.delta*this.alpha)} + (${this.c}*e^{(x*${((this.alpha-this.delta))})})/${(this.alpha-this.delta)} + ${this.c_t})/(e^{${(this.alpha)}*x})`;
    console.log(this.second_equation);
    this.calculator.removeExpression({id: 'graph1'});
    this.calculator.setExpression({ id: 'graph1', latex: this.m_str });
    this.calculator_second.removeExpression({id: 'graph2'});
    this.calculator_second.setExpression({ id: 'graph2', latex: this.second_equation });
  }
  updateDelta($event){
    this.delta = $event.value;
    this.c = (8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
    this.c_t = Math.E**(1985*this.alpha)*(0.3-this.mu*this.beta*this.E/this.delta) + (this.alpha*this.mu*this.c*Math.E**(1985*(this.alpha-this.delta)))/(this.alpha-this.delta);
    this.m_str=`f(x) = ${(this.beta*this.E)/(this.delta)} + ${(this.c)}*e^{(-${(this.delta)}*x)}`
    this.second_equation = `f(x) = (${this.toFixed(this.alpha*this.mu)})*(e^{(${this.alpha}*x)}*${(this.beta*this.E)/(this.delta*this.alpha)} + (${this.c}*e^{(x*${((this.alpha-this.delta))})})/${(this.alpha-this.delta)} + ${this.c_t})/(e^{${(this.alpha)}*x})`;
    console.log(this.second_equation);
    this.calculator.removeExpression({id: 'graph1'});
    this.calculator.setExpression({ id: 'graph1', latex: this.m_str });
    this.calculator_second.removeExpression({id: 'graph2'});
    this.calculator_second.setExpression({ id: 'graph2', latex: this.second_equation });
  }
  updateE($event){
    this.E = $event.value;
    this.c = (8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
    this.c_t = Math.E**(1985*this.alpha)*(0.3-this.mu*this.beta*this.E/this.delta) + (this.alpha*this.mu*this.c*Math.E**(1985*(this.alpha-this.delta)))/(this.alpha-this.delta);
    this.m_str=`f(x) = ${(this.beta*this.E)/(this.delta)} + ${(this.c)}*e^{(-${(this.delta)}*x)}`
    this.second_equation = `f(x) = (${this.toFixed(this.alpha*this.mu)})*(e^{(${this.alpha}*x)}*${(this.beta*this.E)/(this.delta*this.alpha)} + (${this.c}*e^{(x*${((this.alpha-this.delta))})})/${(this.alpha-this.delta)} + ${this.c_t})/(e^{${(this.alpha)}*x})`;
    console.log(this.second_equation);
    this.calculator.removeExpression({id: 'graph1'});
    this.calculator.setExpression({ id: 'graph1', latex: this.m_str });
    this.calculator_second.removeExpression({id: 'graph2'});
    this.calculator_second.setExpression({ id: 'graph2', latex: this.second_equation });
  }
  updateMu($event){
    this.mu = $event.value;
    // console.log(this.mu)
    this.c = (8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
    this.c_t = Math.E**(1985*this.alpha)*(0.3-this.mu*this.beta*this.E/this.delta) + (this.alpha*this.mu*this.c*Math.E**(1985*(this.alpha-this.delta)))/(this.alpha-this.delta);
    this.second_equation = `f(x) = (${this.toFixed(this.alpha*this.mu)})*(e^{(${this.alpha}*x)}*${(this.beta*this.E)/(this.delta*this.alpha)} + (${this.c}*e^{(x*${((this.alpha-this.delta))})})/${(this.alpha-this.delta)} + ${this.c_t})/(e^{${(this.alpha)}*x})`;
    console.log(this.second_equation);
    this.calculator_second.removeExpression({id: 'graph2'});
    this.calculator_second.setExpression({ id: 'graph2', latex: this.second_equation });
  }
  updateAlpha($event){
    this.alpha = $event.value;
    this.c = (8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
    this.c_t = Math.E**(1985*this.alpha)*(0.3-this.mu*this.beta*this.E/this.delta) + (this.alpha*this.mu*this.c*Math.E**(1985*(this.alpha-this.delta)))/(this.alpha-this.delta);
    this.second_equation = `f(x) = (${this.toFixed(this.alpha*this.mu)})*(e^{(${this.alpha}*x)}*${(this.beta*this.E)/(this.delta*this.alpha)} + (${this.c}*e^{(x*${((this.alpha-this.delta))})})/${(this.alpha-this.delta)} + ${this.c_t})/(e^{${(this.alpha)}*x})`;
    console.log(this.second_equation);
    this.calculator_second.removeExpression({id: 'graph2'});
    this.calculator_second.setExpression({ id: 'graph2', latex: this.second_equation });
  }

  ngAfterViewInit(){
    window.addEventListener("scroll",(ev)=>this.checkPosition(ev))
    window.addEventListener("resize",()=>this.init())
  }
  
  ngOnInit(): void {
    this.elements = document.querySelectorAll('.hidden');
    this.windowHeight = window.innerHeight;
    this.options.title = 'Interactive graph'
    this.options.target = '#graph'
    this.options.width = 700
    this.options.height = 500
    this.options.grid = true
    this.options.xAxis = {
      label: 'x - axis',
      domain: [-10, 10]
    }
    this.options.yAxis={
      label: 'y - axis',
      domain: [0, 6]
    }
    this.options.data = [{
      fn:  '10000 + (-40869820.33594122)*e^{(-0.005*x)}',
        // derivative:{
        //   fn:'2x',
        //   updateOnMouseMove:true
        // }
    }]
    // functionPlot(this.options);
    var elt = document.getElementById('graph');
    var second_elt = document.getElementById('graph_second')
    this.calculator = Desmos.GraphingCalculator(elt,this.getOptions());
    this.calculator_second = Desmos.GraphingCalculator(second_elt, this.getOptions());
    this.calculator_second.setExpression({id:'graph2', latex: '(8*10^{-7})*(e^{(0.02*x)}*500000+(-40869820.33594122*e^{(x*0.015)})/0.015+-36038056874264424)/(e^{0.02*x})'})
    this.calculator.setExpression({ id: 'graph1', latex: '10000 + (-40869820.33594122)*e^{(-0.005*x)}' });
    this.calculator.updateSettings({expressions:false,keypad:false})
    this.calculator_second.updateSettings({expressions:false,keypad:false})
    this.calculator.setMathBounds({
      left: 0,
      right: 2022,
      bottom: -5000000,
      top: 1000000
    })
    this.calculator_second.setMathBounds({
      left: 0,
      right: 2022,
      bottom: -5000000,
      top: 1000000
    })
    const data = 'some text';
    const blob = new Blob([data], { type: 'application/octet-stream' });

    this.code_file_url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

   getOptions() {
    return JSON.stringify({
      keypad: true,
      graphpaper: true,
      expressions:false,
      settingsMenu:true,
      zoomButtons: true,
      expressionsTopbar:false,
      pointsOfInterest: true,
      singleVariableSolutions: true,
      border: true,
      lockViewport: false,
      expressionsCollapsed: true
    });
  }
}

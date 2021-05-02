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
    "[3] W. D. Nordhaus, “To slow or not to slow: the economics of the greenhouse effect,” The Economic Journal, vol. 101, no. 407, pp. 920–937, 1991, doi: 10.2307/2233864."
  ]
  eqn_one = "Ṫ(t) = α{μM(t) – T(t)}";
  eqn_one_simp = "Ṫ(t) = α{g[M(t)] – T(t)}";
  beta:number = 0.5;
  delta:number = 0.005;
  E:number = 100;
  c=(8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
  // c=(8000 - (this.beta*this.E));
  m_str=`${(this.beta*this.E)/(this.delta)} + ${(this.c)}*e^(-${(this.delta)}*x)`
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
  o_eqn = "M(t) = βE/δ + C*exp(-δt)";
  calculator;
  calculator_second;
  elements;
  windowHeight;
  code_loc = "https://firebasestorage.googleapis.com/v0/b/team-nii.appspot.com/o/Project_ode45_fin.m?alt=media&token=236796d9-da05-4fa4-b028-f68d261e7690";
  pdf_loc = "https://firebasestorage.googleapis.com/v0/b/team-nii.appspot.com/o/Project_ode45_fin.pdf?alt=media&token=b380adb0-d691-42a2-ad61-adbec23beb51";
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
    this.m_str=`f(x) = ${(this.beta*this.E)/(this.delta)} + ${(this.c)}*e^{(-${(this.delta)}*x)}`
    this.calculator.removeExpression({id: 'graph1'});
    this.calculator.setExpression({ id: 'graph1', latex: this.m_str });
    // console.log(this.m_str)
    // console.log(this.m_str)
  }
  updateDelta($event){
    this.delta = $event.value;
    this.c = (8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
    this.m_str=`f(x) = (${(this.beta*this.E)/(this.delta)} + ${(this.c)})*e^{(-${(this.delta)}*x)}`
    this.calculator.removeExpression({id: 'graph1'});
    this.calculator.setExpression({ id: 'graph1', latex: this.m_str });
    // console.log(this.m_str)
  }
  updateE($event){
    this.E = $event.value;
    this.c = (8000 - (this.beta*this.E)/(this.delta)) * Math.E**(1985*this.delta);
    this.m_str=`f(x) = (${(this.beta*this.E)/(this.delta)} + ${(this.c)})*e^{(-${(this.delta)}*x)}`
    this.calculator.removeExpression({id: 'graph1'});
    this.calculator.setExpression({ id: 'graph1', latex: this.m_str });
    // console.log(this.m_str)
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
    this.calculator.setExpression({ id: 'graph1', latex: '10000 + (-40869820.33594122)*e^{(-0.005*x)}' });
    this.calculator.updateSettings({expressions:false,keypad:false})
    this.calculator_second.updateSettings({expressions:false,keypad:false})
    this.calculator.setMathBounds({
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

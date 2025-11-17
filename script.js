function renderMath(el) {
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([el]).catch(console.error);
  }
}

function fmt(x, decimals = 2) {
  return Number(x).toFixed(decimals);
}

function fmtSmart(x) {
  const ax = Math.abs(x);
  if (!isFinite(x)) return "—";
  if (ax >= 10000 || (ax > 0 && ax < 0.0001)) {
    return x.toExponential(2);
  }
  return x.toFixed(4);
}

document.addEventListener("DOMContentLoaded", () => {
  /* TABIT */
  const tabs = document.querySelectorAll(".tab-btn");
  const sections = document.querySelectorAll(".section");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const target = btn.dataset.target;
      sections.forEach(sec => {
        sec.classList.toggle("active", sec.id === target);
      });
    });
  });

  /* ABOUT */
  const aboutBtn = document.getElementById("about-btn");
  const aboutOverlay = document.getElementById("about-overlay");
  const aboutClose = document.getElementById("about-close");
  aboutBtn.addEventListener("click", () => aboutOverlay.classList.add("active"));
  aboutClose.addEventListener("click", () => aboutOverlay.classList.remove("active"));
  aboutOverlay.addEventListener("click", e => {
    if (e.target === aboutOverlay) aboutOverlay.classList.remove("active");
  });

  /* YHTEISET SUHDEKAAVAT */
  const ratioMode = document.getElementById("ratio-mode");
  const ratioSymbolic = document.getElementById("ratio-symbolic");
  const ratioNumeric = document.getElementById("ratio-numeric");
  const ratioNum = document.getElementById("ratio-num");
  const ratioDen = document.getElementById("ratio-den");
  const ratioNumLabel = document.getElementById("ratio-num-label");
  const ratioDenLabel = document.getElementById("ratio-den-label");
  const ratioNumVal = document.getElementById("ratio-num-val");
  const ratioDenVal = document.getElementById("ratio-den-val");
  const ratioHint = document.getElementById("ratio-hint");

  const ratioConfigs = {
    density: {
      symbolic: "\\rho = \\dfrac{m}{V}",
      xSymbol: "\\rho",
      xUnit: "\\text{g/mL}",
      numLabel: "m (massa, g)",
      denLabel: "V (tilavuus, mL)",
      numUnit: "\\text{g}",
      denUnit: "\\text{mL}",
      numMin: 10, numMax: 200, numStep: 5, numInit: 100,
      denMin: 10, denMax: 200, denStep: 5, denInit: 100,
      hint: "<strong>Kun lisäät massaa mutta tilavuus pysyy, tiheys kasvaa.</strong> Kun kasvatat tilavuutta ilman massan muutosta, tiheys pienenee."
    },
    conc: {
      symbolic: "c = \\dfrac{n}{V}",
      xSymbol: "c",
      xUnit: "\\text{mol/L}",
      numLabel: "n (mol)",
      denLabel: "V (L)",
      numUnit: "\\text{mol}",
      denUnit: "\\text{L}",
      numMin: 0.10, numMax: 2.00, numStep: 0.05, numInit: 0.50,
      denMin: 0.10, denMax: 5.00, denStep: 0.10, denInit: 1.00,
      hint: "<strong>Laimennuslasku on murtoluku:</strong> lisää tilavuutta → pitoisuus pienenee samassa suhteessa."
    },
    speed: {
      symbolic: "v = \\dfrac{s}{t}",
      xSymbol: "v",
      xUnit: "\\text{km/h}",
      numLabel: "s (matka, km)",
      denLabel: "t (aika, h)",
      numUnit: "\\text{km}",
      denUnit: "\\text{h}",
      numMin: 1, numMax: 200, numStep: 1, numInit: 50,
      denMin: 0.25, denMax: 5.00, denStep: 0.25, denInit: 1.00,
      hint: "<strong>Sama matka pidemmällä ajalla → pienempi keskinopeus.</strong> Sama aika pidemmälle matkalle → suurempi keskinopeus."
    },
    rate: {
      symbolic: "v = \\dfrac{\\Delta c}{\\Delta t}",
      xSymbol: "v",
      xUnit: "\\text{mol\\,L}^{-1}\\text{s}^{-1}",
      numLabel: "Δc (mol/L)",
      denLabel: "Δt (s)",
      numUnit: "\\text{mol/L}",
      denUnit: "\\text{s}",
      numMin: 0.01, numMax: 1.00, numStep: 0.01, numInit: 0.10,
      denMin: 1, denMax: 120, denStep: 1, denInit: 10,
      hint: "<strong>Suuri konsentraation muutos lyhyessä ajassa → suuri reaktionopeus.</strong>"
    }
  };

  let currentRatioCfg = ratioConfigs.density;

  function applyRatioConfig(cfg) {
    currentRatioCfg = cfg;
    ratioSymbolic.innerHTML = `\\(${cfg.symbolic}\\)`;
    renderMath(ratioSymbolic);

    ratioNum.min = cfg.numMin;
    ratioNum.max = cfg.numMax;
    ratioNum.step = cfg.numStep;
    ratioNum.value = cfg.numInit;

    ratioDen.min = cfg.denMin;
    ratioDen.max = cfg.denMax;
    ratioDen.step = cfg.denStep;
    ratioDen.value = cfg.denInit;

    ratioNumLabel.childNodes[0].textContent = cfg.numLabel + " ";
    ratioDenLabel.childNodes[0].textContent = cfg.denLabel + " ";
    ratioHint.innerHTML = cfg.hint;

    updateRatioValues();
  }

  function updateRatioValues() {
    const cfg = currentRatioCfg;
    const num = Number(ratioNum.value);
    const den = Number(ratioDen.value);
    const x = num / den;

    ratioNumVal.textContent = fmt(num, 2);
    ratioDenVal.textContent = fmt(den, 2);

    const tex =
      `${cfg.xSymbol} = \\dfrac{${fmt(num,2)}\\,${cfg.numUnit}}{${fmt(den,2)}\\,${cfg.denUnit}} = ${fmt(x,3)}\\,${cfg.xUnit}`;
    ratioNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(ratioNumeric);
  }

  ratioMode.addEventListener("change", () => {
    applyRatioConfig(ratioConfigs[ratioMode.value]);
  });
  ratioNum.addEventListener("input", updateRatioValues);
  ratioDen.addEventListener("input", updateRatioValues);
  applyRatioConfig(currentRatioCfg);

  /* FYSIIKKA */

  // Ohm
  const ohmR = document.getElementById("ohm-R");
  const ohmI = document.getElementById("ohm-I");
  const ohmRVal = document.getElementById("ohm-R-val");
  const ohmIVal = document.getElementById("ohm-I-val");
  const ohmNumeric = document.getElementById("ohm-numeric");

  function updateOhm() {
    const R = Number(ohmR.value);
    const I = Number(ohmI.value);
    const U = R * I;
    ohmRVal.textContent = R + " Ω";
    ohmIVal.textContent = fmt(I, 2) + " A";
    const tex = `U = ${R}\\,\\Omega \\cdot ${fmt(I,2)}\\,\\text{A} = ${fmt(U,2)}\\,\\text{V}`;
    ohmNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(ohmNumeric);
  }
  ohmR.addEventListener("input", updateOhm);
  ohmI.addEventListener("input", updateOhm);

  // Liike-energia
  const keM = document.getElementById("ke-m");
  const keV = document.getElementById("ke-v");
  const keMVal = document.getElementById("ke-m-val");
  const keVVal = document.getElementById("ke-v-val");
  const keNumeric = document.getElementById("ke-numeric");

  function updateKE() {
    const m = Number(keM.value);
    const v = Number(keV.value);
    const E = 0.5 * m * v * v;
    keMVal.textContent = m + " kg";
    keVVal.textContent = v + " m/s";
    const tex = `E_k = \\dfrac{1}{2} \\cdot ${m}\\,\\text{kg} \\cdot (${v}\\,\\text{m/s})^2 = ${fmt(E,0)}\\,\\text{J}`;
    keNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(keNumeric);
  }
  keM.addEventListener("input", updateKE);
  keV.addEventListener("input", updateKE);

  // Harmoninen värähtelijä
  const oscM = document.getElementById("osc-m");
  const oscK = document.getElementById("osc-k");
  const oscMVal = document.getElementById("osc-m-val");
  const oscKVal = document.getElementById("osc-k-val");
  const oscNumeric = document.getElementById("osc-numeric");

  function updateOsc() {
    const m = Number(oscM.value);
    const k = Number(oscK.value);
    const T = 2 * Math.PI * Math.sqrt(m / k);
    oscMVal.textContent = fmt(m, 2) + " kg";
    oscKVal.textContent = fmt(k, 1) + " N/m";
    const tex =
      `T = 2\\pi \\sqrt{\\dfrac{${fmt(m,2)}}{${fmt(k,1)}}} \\approx ${fmt(T,2)}\\,\\text{s}`;
    oscNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(oscNumeric);
  }
  oscM.addEventListener("input", updateOsc);
  oscK.addEventListener("input", updateOsc);

  // Gravitaatio
  const gravM1 = document.getElementById("grav-m1");
  const gravM2 = document.getElementById("grav-m2");
  const gravR = document.getElementById("grav-r");
  const gravM1Val = document.getElementById("grav-m1-val");
  const gravM2Val = document.getElementById("grav-m2-val");
  const gravRVal = document.getElementById("grav-r-val");
  const gravNumeric = document.getElementById("grav-numeric");
  const G = 6.674e-11;

  function updateGrav() {
    const m1 = Number(gravM1.value);
    const m2 = Number(gravM2.value);
    const r = Number(gravR.value);
    const F = G * m1 * m2 / (r * r);
    gravM1Val.textContent = m1 + " kg";
    gravM2Val.textContent = m2 + " kg";
    gravRVal.textContent = fmt(r, 2) + " m";
    const tex =
      `F = 6.674\\times 10^{-11} \\cdot \\dfrac{${m1}\\,\\text{kg} \\cdot ${m2}\\,\\text{kg}}{(${fmt(r,2)}\\,\\text{m})^2} \\approx ${fmtSmart(F)}\\,\\text{N}`;
    gravNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(gravNumeric);
  }
  gravM1.addEventListener("input", updateGrav);
  gravM2.addEventListener("input", updateGrav);
  gravR.addEventListener("input", updateGrav);

  // Lämpöenergia
  const heatC = document.getElementById("heat-c");
  const heatM = document.getElementById("heat-m");
  const heatDT = document.getElementById("heat-dT");
  const heatCVal = document.getElementById("heat-c-val");
  const heatMVal = document.getElementById("heat-m-val");
  const heatDTVal = document.getElementById("heat-dT-val");
  const heatNumeric = document.getElementById("heat-numeric");

  function updateHeat() {
    const c = Number(heatC.value);
    const m = Number(heatM.value);
    const dT = Number(heatDT.value);
    const Q = c * m * dT;
    const QkJ = Q / 1000;
    heatCVal.textContent = c + " J/(kg·K)";
    heatMVal.textContent = fmt(m, 2) + " kg";
    heatDTVal.textContent = dT + " K";
    const tex =
      `Q = ${c}\\,\\text{J/(kg·K)} \\cdot ${fmt(m,2)}\\,\\text{kg} \\cdot ${dT}\\,\\text{K} = ${fmt(QkJ,1)}\\,\\text{kJ}`;
    heatNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(heatNumeric);
  }
  heatC.addEventListener("input", updateHeat);
  heatM.addEventListener("input", updateHeat);
  heatDT.addEventListener("input", updateHeat);

  /* KEMIA: ideaalikaasu + erikoistapaukset */
  const gasMode = document.getElementById("gas-mode");
  const gasSymbolic = document.getElementById("gas-symbolic");
  const gasNumericBox = document.getElementById("gas-numeric");
  const gasRel = document.getElementById("gas-relationship");
  const gasL1 = document.getElementById("gas-l1");
  const gasL2 = document.getElementById("gas-l2");
  const gasL3 = document.getElementById("gas-l3");
  const gasL3Row = document.getElementById("gas-l3-row");
  const gasL1Label = document.getElementById("gas-l1-label");
  const gasL2Label = document.getElementById("gas-l2-label");
  const gasL3Label = document.getElementById("gas-l3-label");
  const gasL1Val = document.getElementById("gas-l1-val");
  const gasL2Val = document.getElementById("gas-l2-val");
  const gasL3Val = document.getElementById("gas-l3-val");
  const gasHint = document.getElementById("gas-hint");

  const gasConfigs = {
    ideal: {
      symbolic: "pV = nRT \\Rightarrow p = \\dfrac{nRT}{V}",
      relationship:
        "<strong>Paine kasvaa, kun lisäät ainemäärää tai lämpötilaa, ja pienenee, kun tilavuus kasvaa.</strong>",
      l1Label: "n (mol)",
      l2Label: "T (K)",
      l3Label: "V (m³)",
      l1: { min: 0.10, max: 5.00, step: 0.10, val: 1.00 },
      l2: { min: 250, max: 350, step: 5, val: 298 },
      l3: { min: 0.01, max: 1.00, step: 0.01, val: 0.10 },
      hint: "<strong>Tilavuuden puolittaminen kaksinkertaistaa paineen</strong> (n ja T vakio).",
    },
    boyle: {
      symbolic: "p_1 V_1 = p_2 V_2 \\quad (T \\text{ vakio})",
      relationship:
        "<strong>Boylen laki:</strong> paine ja tilavuus ovat kääntäen verrannollisia.",
      l1Label: "p₁ (kPa)",
      l2Label: "V₁ (L)",
      l3Label: "V₂ (L)",
      l1: { min: 50, max: 200, step: 5, val: 100 },
      l2: { min: 1, max: 10, step: 0.5, val: 5 },
      l3: { min: 1, max: 10, step: 0.5, val: 2.5 },
      hint: "<strong>Kun V₂ on puolet V₁:stä, p₂ on kaksinkertainen.</strong>",
    },
    charles: {
      symbolic: "\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2} \\quad (p \\text{ vakio})",
      relationship:
        "<strong>Charlesin laki:</strong> tilavuus on verrannollinen lämpötilaan (K).",
      l1Label: "V₁ (L)",
      l2Label: "T₁ (K)",
      l3Label: "T₂ (K)",
      l1: { min: 1, max: 10, step: 0.5, val: 5 },
      l2: { min: 250, max: 350, step: 5, val: 298 },
      l3: { min: 250, max: 350, step: 5, val: 320 },
      hint: "<strong>Lämpötilan kaksinkertaistaminen kaksinkertaistaa myös tilavuuden</strong> (ihannekaasu).",
    },
    gay: {
      symbolic: "\\dfrac{p_1}{T_1} = \\dfrac{p_2}{T_2} \\quad (V \\text{ vakio})",
      relationship:
        "<strong>Gay-Lussacin laki:</strong> paine on verrannollinen lämpötilaan.",
      l1Label: "p₁ (kPa)",
      l2Label: "T₁ (K)",
      l3Label: "T₂ (K)",
      l1: { min: 50, max: 200, step: 5, val: 100 },
      l2: { min: 250, max: 350, step: 5, val: 298 },
      l3: { min: 250, max: 350, step: 5, val: 320 },
      hint: "<strong>Lämpötilan nousu nostaa painetta samassa suhteessa.</strong>",
    }
  };

  let currentGasCfg = gasConfigs.ideal;
  const Rgas = 8.314;

  function applyGasConfig(cfg) {
    currentGasCfg = cfg;
    gasSymbolic.innerHTML = `\\(${cfg.symbolic}\\)`;
    renderMath(gasSymbolic);

    gasRel.innerHTML = cfg.relationship;
    gasHint.innerHTML = cfg.hint;

    gasL1Label.childNodes[0].textContent = cfg.l1Label + " ";
    gasL2Label.childNodes[0].textContent = cfg.l2Label + " ";
    gasL3Label.childNodes[0].textContent = cfg.l3Label + " ";

    gasL1.min = cfg.l1.min; gasL1.max = cfg.l1.max; gasL1.step = cfg.l1.step; gasL1.value = cfg.l1.val;
    gasL2.min = cfg.l2.min; gasL2.max = cfg.l2.max; gasL2.step = cfg.l2.step; gasL2.value = cfg.l2.val;
    gasL3.min = cfg.l3.min; gasL3.max = cfg.l3.max; gasL3.step = cfg.l3.step; gasL3.value = cfg.l3.val;

    gasL3Row.style.display = "block";
    updateGasValues();
  }

  function updateGasValues() {
    const cfg = currentGasCfg;
    const a = Number(gasL1.value);
    const b = Number(gasL2.value);
    const c = Number(gasL3.value);

    gasL1Val.textContent = fmt(a, 2);
    gasL2Val.textContent = fmt(b, 2);
    gasL3Val.textContent = fmt(c, 2);

    let tex = "";
    if (cfg === gasConfigs.ideal) {
      const n = a, T = b, V = c;
      const pPa = n * Rgas * T / V;
      const pKPa = pPa / 1000;
      tex = `p = \\dfrac{${fmt(n,2)} \\cdot 8.314 \\cdot ${T}}{${fmt(V,3)}} \\approx ${fmt(pKPa,1)}\\,\\text{kPa}`;
    } else if (cfg === gasConfigs.boyle) {
      const p1 = a, V1 = b, V2 = c;
      const p2 = p1 * V1 / V2;
      tex = `p_2 = \\dfrac{${fmt(p1,1)} \\cdot ${fmt(V1,2)}}{${fmt(V2,2)}} \\approx ${fmt(p2,1)}\\,\\text{kPa}`;
    } else if (cfg === gasConfigs.charles) {
      const V1 = a, T1 = b, T2 = c;
      const V2 = V1 * T2 / T1;
      tex = `V_2 = ${fmt(V1,2)} \\cdot \\dfrac{${T2}}{${T1}} \\approx ${fmt(V2,2)}\\,\\text{L}`;
    } else if (cfg === gasConfigs.gay) {
      const p1 = a, T1 = b, T2 = c;
      const p2 = p1 * T2 / T1;
      tex = `p_2 = ${fmt(p1,1)} \\cdot \\dfrac{${T2}}{${T1}} \\approx ${fmt(p2,1)}\\,\\text{kPa}`;
    }

    gasNumericBox.innerHTML = `\\(${tex}\\)`;
    renderMath(gasNumericBox);
  }

  gasMode.addEventListener("change", () => {
    applyGasConfig(gasConfigs[gasMode.value]);
  });
  gasL1.addEventListener("input", updateGasValues);
  gasL2.addEventListener("input", updateGasValues);
  gasL3.addEventListener("input", updateGasValues);

  /* Entalpia */
  const enthN = document.getElementById("enth-n");
  const enthHm = document.getElementById("enth-Hm");
  const enthNVal = document.getElementById("enth-n-val");
  const enthHmVal = document.getElementById("enth-Hm-val");
  const enthNumeric = document.getElementById("enthalpy-numeric");

  function updateEnthalpy() {
    const n = Number(enthN.value);
    const Hm = Number(enthHm.value);
    const H = n * Hm;
    enthNVal.textContent = fmt(n, 2) + " mol";
    enthHmVal.textContent = Hm + " kJ/mol";
    const tex = `\\Delta H = ${fmt(n,2)}\\,\\text{mol} \\cdot ${Hm}\\,\\text{kJ/mol} = ${fmt(H,1)}\\,\\text{kJ}`;
    enthNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(enthNumeric);
  }
  enthN.addEventListener("input", updateEnthalpy);
  enthHm.addEventListener("input", updateEnthalpy);

  /* Tasapainovakio/Q */
  const eqA = document.getElementById("eq-A");
  const eqB = document.getElementById("eq-B");
  const eqAVal = document.getElementById("eq-A-val");
  const eqBVal = document.getElementById("eq-B-val");
  const eqNumeric = document.getElementById("eq-numeric");
  const eqStatus = document.getElementById("eq-status");
  const Kconst = 2.0;

  function updateEq() {
    const A = Number(eqA.value);
    const B = Number(eqB.value);
    const Q = B / A;
    eqAVal.textContent = fmt(A, 2) + " mol/L";
    eqBVal.textContent = fmt(B, 2) + " mol/L";

    const tex =
      `Q = \\dfrac{[\\text{B}]}{[\\text{A}]} = \\dfrac{${fmt(B,2)}}{${fmt(A,2)}} = ${fmt(Q,2)},\\quad K = ${Kconst.toFixed(1)}`;
    eqNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(eqNumeric);

    let msg;
    if (Q < Kconst) {
      msg = `Nyt \\(Q < K\\): <span>systeemi pyrkii kohti tuotteita (oikealle)</span>.`;
    } else if (Q > Kconst) {
      msg = `Nyt \\(Q > K\\): <span>systeemi pyrkii kohti lähtöaineita (vasemmalle)</span>.`;
    } else {
      msg = `Nyt \\(Q \\approx K\\): <span>systeemi on tasapainossa</span>.`;
    }
    eqStatus.innerHTML = msg;
    renderMath(eqStatus);
  }
  eqA.addEventListener("input", updateEq);
  eqB.addEventListener("input", updateEq);

  /* pH happo/emäs */
  const phMode = document.getElementById("ph-mode");
  const phSymbolic = document.getElementById("ph-symbolic");
  const phNumeric = document.getElementById("ph-numeric");
  const phRelationship = document.getElementById("ph-relationship");
  const phExp = document.getElementById("ph-exp");
  const phExpVal = document.getElementById("ph-exp-val");
  const phExpLabel = document.getElementById("ph-exp-label");
  const phHint = document.getElementById("ph-hint");

  function applyPhMode() {
    const mode = phMode.value;
    if (mode === "acid") {
      phSymbolic.innerHTML = "\\( \\mathrm{pH} = -\\log_{10}[\\mathrm{H_3O^+}] \\)";
      phRelationship.innerHTML =
        "<strong>Vahvalla hapolla pH ≈ eksponentti x, kun [H₃O⁺] = 10^{-x}.</strong>";
      phExpLabel.childNodes[0].textContent =
        "Eksponentti, [H₃O⁺] = 10⁻ˣ mol/L ";
    } else {
      phSymbolic.innerHTML =
        "\\( \\mathrm{pOH} = -\\log_{10}[\\mathrm{OH^-}], \\quad \\mathrm{pH} = 14 - \\mathrm{pOH} \\)";
      phRelationship.innerHTML =
        "<strong>Vahvalla emäksellä pOH ≈ eksponentti x, kun [OH⁻] = 10^{-x},</strong> ja pH = 14 − x.";
      phExpLabel.childNodes[0].textContent =
        "Eksponentti, [OH⁻] = 10⁻ˣ mol/L ";
    }
    renderMath(phSymbolic);
    renderMath(phRelationship);
    updatePH();
  }

  function updatePH() {
    const x = Number(phExp.value);
    const mode = phMode.value;
    phExpVal.textContent = fmt(x, 1);

    let tex;
    if (mode === "acid") {
      const pH = x;
      tex =
        `[\\text{H}_3\\text{O}^+] = 10^{-${fmt(x,1)}} \\Rightarrow \\mathrm{pH} = ${fmt(pH,2)}`;
      phHint.innerHTML =
        "<strong>Konentraation pieneneminen 10⁻³ → 10⁻⁵ nostaa pH:ta kahdella yksiköllä.</strong>";
    } else {
      const pOH = x;
      const pH = 14 - pOH;
      tex =
        `[\\text{OH}^-] = 10^{-${fmt(x,1)}} \\Rightarrow \\mathrm{pOH} = ${fmt(pOH,2)},\\; \\mathrm{pH} = 14 - ${fmt(pOH,2)} = ${fmt(pH,2)}`;
      phHint.innerHTML =
        "<strong>Kun [OH⁻] pienenee, pOH kasvaa ja pH pienenee.</strong>";
    }

    phNumeric.innerHTML = `\\(${tex}\\)`;
    renderMath(phNumeric);
  }

  phMode.addEventListener("change", applyPhMode);
  phExp.addEventListener("input", updatePH);

  /* TEHTÄVÄT: monivalinnat */

  const taskCards = document.querySelectorAll(".task-card");

  const taskData = {
    1: {
      correct: "c",
      explanation:
        "<strong>Tiheys kaksinkertaistuu.</strong> Kaava on \\(\\rho = m/V\\). Tilavuus on vakio, joten jos m kaksinkertaistuu, myös tiheys kaksinkertaistuu."
    },
    2: {
      correct: "c",
      explanation:
        "<strong>Paine kaksinkertaistuu.</strong> Boylen lain mukaan \\(p_1V_1 = p_2V_2\\). Jos V puolittuu, paineen pitää kaksinkertaistua, jotta tulo pysyy samana."
    },
    3: {
      correct: "b",
      explanation:
        "<strong>Jaksonaika kaksinkertaistuu.</strong> Kaavassa \\(T = 2\\pi\\sqrt{m/k}\\) massa on neliöjuuren sisällä. Nelinkertainen massa → \\(\\sqrt{4}=2\\) → T kasvaa vain kahdella."
    },
    4: {
      correct: "b",
      explanation:
        "<strong>Liuos muuttuu emäksisemmäksi.</strong> Kun [H₃O⁺] pienenee 10⁻³ → 10⁻⁵, eksponentti kasvaa 3 → 5 ja pH kasvaa 3 → 5."
    },
    5: {
      correct: "b",
      explanation:
        "<strong>pH pienenee yhdellä yksiköllä.</strong> [OH⁻] pienenee 10⁻² → 10⁻³: pOH kasvaa 2 → 3 ja pH = 14 − pOH pienenee 12 → 11."
    },
    6: {
      correct: "c",
      explanation:
        "<strong>Keskinopeus on 2/3 alkuperäisestä.</strong> v = s/t. Uudessa tilanteessa v₂/v₁ = (2s)/(3t) : (s/t) = 2/3."
    },
    7: {
      correct: "b",
      explanation:
        "<strong>Energia on -600 kJ.</strong> \\(\\Delta H = n\\Delta H_m\\). Kun n = 3 mol ja \\(\\Delta H_m = -200\\,\\text{kJ/mol}\\), saadaan \\(\\Delta H = 3\\cdot(-200) = -600\\,\\text{kJ}\\)."
    },
    8: {
      correct: "b",
      explanation:
        "<strong>Systeemi siirtyy kohti lähtöaineita.</strong> Alussa Q = 1 < K, lisäyksen jälkeen Q = 3 > K. Kun Q > K, systeemi pyrkii vähentämään tuotteita ja lisäämään lähtöaineita."
    },
    9: {
      correct: "b",
      explanation:
        "<strong>Nopeuden kaksinkertaistaminen kasvattaa energiaa enemmän.</strong> Jos m → 2m, \\(E_k\\) kaksinkertaistuu. Jos v → 2v, \\(E_k\\) muuttuu \\(\\propto v^2\\) → nelinkertaistuu."
    },
    10: {
      correct: "a",
      explanation:
        "<strong>Paine kolminkertaistuu.</strong> Kaavassa \\(p = nRT/V\\) tilavuus ja T ovat vakioita → p on suoraan verrannollinen n:ään. Kun n kasvaa 1 → 3, myös p kasvaa 3-kertaiseksi."
    }
  };

  taskCards.forEach(card => {
    const id = card.dataset.taskId;
    const options = card.querySelectorAll(".task-option");
    const showBtn = card.querySelector(".task-show");
    const feedback = card.querySelector(".task-feedback");
    const cfg = taskData[id];

    function setFeedback(text, highlightCorrectOnly) {
      feedback.innerHTML = text;
      renderMath(feedback);
      if (highlightCorrectOnly) {
        options.forEach(btn => {
          btn.classList.remove("correct", "wrong");
          if (btn.dataset.option === cfg.correct) {
            btn.classList.add("correct");
          }
        });
      }
    }

    options.forEach(btn => {
      btn.addEventListener("click", () => {
        const chosen = btn.dataset.option;
        card.dataset.chosen = chosen;
        options.forEach(b => b.classList.remove("correct", "wrong"));
        if (chosen === cfg.correct) {
          btn.classList.add("correct");
          setFeedback("Oikein! " + cfg.explanation, false);
        } else {
          btn.classList.add("wrong");
          setFeedback("Ei ihan oikein. " + cfg.explanation, true);
        }
      });
    });

    showBtn.addEventListener("click", () => {
      const chosen = card.dataset.chosen;
      if (!chosen) {
        setFeedback("Valitse ensin jokin vastausvaihtoehto.", false);
        return;
      }
      setFeedback("Selitys: " + cfg.explanation, true);
    });
  });

  /* Alustukset */
  updateOhm();
  updateKE();
  updateOsc();
  updateGrav();
  updateHeat();
  applyGasConfig(currentGasCfg);
  updateEnthalpy();
  updateEq();
  applyPhMode();
});
    if(num === 3){
      var body3 = d.querySelector(".theory-body");
      body3.appendChild(el("h4", null, "Ejemplo guiado: la clínica que quiere llegar a S/ 40 000"));
      body3.appendChild(el("p", null, rich("Una clínica tiene $S/\\,30\\,000$ y quiere llegar a $S/\\,40\\,000$ con una tasa de $4\\,\\%$ anual (capitalización anual). ¿En cuántos años?")));
      stepWalk(body3, [
        {title: "Paso 1 · Datos", html: "$P=30000$, $A=40000$, $i=0.04$ por año ($n=1$)."},
        {title: "Paso 2 · Cociente", html: "$\\dfrac{A}{P}=\\dfrac{40000}{30000}=$ <strong>$1.3333$</strong> (guárdalo completo)."},
        {title: "Paso 3 · Logaritmos", html: "$\\ln(1.3333)\\approx$ <strong>$0.287682$</strong> y $\\ln(1.04)\\approx$ <strong>$0.039221$</strong>."},
        {title: "Paso 4 · Divide", html: "$t=\\dfrac{0.287682}{0.039221}\\approx$ <strong>7.33 años</strong>."},
        {title: "Paso 5 · Revisa", html: "Comprobación: $30000\\cdot(1.04)^{7.33}\\approx40\\,000$ ✓. La unidad es <strong>años</strong> porque la tasa era anual."}
      ]);
    }
    if(num === 5){
      var body5 = d.querySelector(".theory-body");
      body5.appendChild(el("h4", null, "Ejemplo guiado: la meta de María (Caso 7)"));
      body5.appendChild(el("p", null, rich("María tiene $S/\\,8\\,000$ y quiere llegar a $S/\\,12\\,000$ con $6.35\\,\\%$ anual capitalizable trimestralmente. ¿Cuánto tiempo necesita?")));
      stepWalk(body5, [
        {title: "Paso 1 · Datos", html: "$P=8000$, $A=12000$, $r=0.0635$ y $n=4$."},
        {title: "Paso 2 · Tasa por periodo", html: "$i=\\dfrac{0.0635}{4}=$ <strong>$0.015875$</strong> por trimestre."},
        {title: "Paso 3 · Cociente y logaritmos", html: "$\\dfrac{A}{P}=1.5$, $\\ln(1.5)\\approx0.405465$ y $\\ln(1.015875)\\approx0.015750$."},
        {title: "Paso 4 · Divide", html: "$\\dfrac{0.405465}{0.015750}\\approx$ <strong>25.74 trimestres</strong>."},
        {title: "Paso 5 · A años", html: "$\\dfrac{25.74}{4}\\approx$ <strong>6.44 años</strong>. ¡Ojo!: no son 25.74 años."}
      ]);
    }

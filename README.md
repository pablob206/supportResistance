# Calculos de Soportes y Resistencias

## Status: beta finish

Este proyecto es un script que consiste en calculos de niveles de S/R (soportes/resistencias) para graficos chartistas de mercados bursatiles, inicialmente pensado para integrarse al bot de cripto-trading abechennon, cuenta con licencia MIT de codigo abierto y puede ser integrado a cualquier proyecto.

Consulte exampleInputSupportResistance.json para chequear el formato admitido del input.

### Uso del clusterThreshold:
Es una variable para indicar el umbral de agrupamiento, por default es %1. Puede modificarlo y experimentar con el mismo. Se espera que mientras el clusterThreshold se aumenta, el output contenera menores niveles de S/R, y mientras por el contrario se disminuya, el output contenera mayor cantidad de niveles de S/R. Esto conlleva a que si mantiene el clusterThreshold muy bajo, entonces tendra muchos niveles S/R y tal vez muchos de ellos no le interesen y lo considere ruido innecesario, y por el contrario si es muy alto tendra pocos niveles S/R y probablemente le esten faltando niveles importantes que si querria incluirlos, o sea estara recortando los resultados. A experimentar y manos a la obra!

## Ejemplo de output (con clusterThreshold default):
```javascript
[
  {
    pivotPrice: 48045.16,
    limitsUp: 48495,
    limitsDown: 47347.53,
    score: 67,
    accumulatedVolume: 44687.15635
  },
  {
    pivotPrice: 47534.34,
    limitsUp: 48336.59,
    limitsDown: 47223.27,
    score: 41,
    accumulatedVolume: 23864.294279999995
  },
  {
    pivotPrice: 44829.4,
    limitsUp: 45000,
    limitsDown: 44829.4,
    score: 8,
    accumulatedVolume: 6010.54166
  },
  {
    pivotPrice: 43996.5,
    limitsUp: 44141.37,
    limitsDown: 43400,
    score: 40,
    accumulatedVolume: 17909.42211
  },
  {
    pivotPrice: 43473.45,
    limitsUp: 43629.15,
    limitsDown: 42787.38,
    score: 37,
    accumulatedVolume: 18501.36496
  },
  {
    pivotPrice: 42819.86,
    limitsUp: 43081.93,
    limitsDown: 42217.13,
    score: 15,
    accumulatedVolume: 6355.429050000001
  },
  {
    pivotPrice: 42259.58,
    limitsUp: 42787.38,
    limitsDown: 42017.33,
    score: 24,
    accumulatedVolume: 12506.830009999998
  },
  {
    pivotPrice: 41619.99,
    limitsUp: 42722.3,
    limitsDown: 41259,
    score: 91,
    accumulatedVolume: 42944.990900000004
  },
  {
    pivotPrice: 41071.29,
    limitsUp: 41472.92,
    limitsDown: 41071.29,
    score: 8,
    accumulatedVolume: 4474.11918
  }
]
    .....
```  

#### pivotPrice: 
Linea de soporte/resistencia.

#### limitsUp/limitsDown: 
Zona de soporte/resistencia.

#### Score, puntuacion del soporte/resistencia: 
Si la puntuacion es alta significa que muchas velas han sido negociadas en esa zona, en cambio una puntuacion baja puede deberse a que no es una zona muy negociada o que pertenece a un maximo mayor o minimo menor (zonas muy importantes, pero no superadas en el corto plazo y de baja negociacion).

#### accumulatedVolume:
Volumen acumulado negociado en la zona consolidada entre limitsUp/limitsDown.


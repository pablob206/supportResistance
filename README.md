# Calculos de Soportes y Resistencias

## Status: alpha finish
## Status: beta in progress


Este proyecto consiste en calculos de niveles de soportes/resistencias para graficos chartistas de mercados bursatiles, inicialmente pensado para integrarse al bot de cripto-trading abechennon, cuenta con licencia MIT de codigo abierto y puede ser integrado a cualquier proyecto.

Consulte exampleInputSupportResistance.json para chequear el formato admitido del input, en version alpha puede omitir: open y close.
Pero para versiones subsiguientes debera suministrarlo ya que si seran tenidos en cuenta.


## Ejemplo de output:
```javascript
[
  {
    pivotPrice: 47729.99,
    limitsUp: 48495,
    limitsDown: 47347.53,
    score: 67,
    accumulatedVolume: 44687.156350000005
  },
  {
    pivotPrice: 47534.34,
    limitsUp: 48336.59,
    limitsDown: 47235.36,
    score: 41,
    accumulatedVolume: 23864.294279999995
  },
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


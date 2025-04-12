import { useState } from "react";
import { Input } from "./components/ui/input";
import { Card, CardContent } from "./components/ui/card";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Leaf, Info } from "lucide-react";

export default function BHOCalculator() {
  const [cannabisWeight, setCannabisWeight] = useState(35);
  const [thcPercent, setThcPercent] = useState(32);
  const [bhoYieldPercent, setBhoYieldPercent] = useState(20);
  const [oilVolume, setOilVolume] = useState(500);
  const [updated, setUpdated] = useState(false);

  const handleUpdate = () => setUpdated(!updated);

  const totalTHC = (cannabisWeight * thcPercent) / 100;
  const bhoAmount = (cannabisWeight * bhoYieldPercent) / 100;
  const extractionEfficiency = 0.75;
  const thcInBHO = totalTHC * extractionEfficiency;
  const estimatedBhoThcPurity = (thcInBHO / bhoAmount) * 100;

  const thcInBHOmg = thcInBHO * 1000;
  const thcPerMl = thcInBHOmg / oilVolume;
  const dosePerDrop = thcPerMl / 20;
  const dosePer5ml = thcPerMl * 5;

  const thcVarMin = thcPercent * 0.9;
  const thcVarMax = thcPercent * 1.1;
  const totalTHCMin = (cannabisWeight * thcVarMin) / 100 * extractionEfficiency * 1000;
  const totalTHCMax = (cannabisWeight * thcVarMax) / 100 * extractionEfficiency * 1000;
  const thcPerMlMin = totalTHCMin / oilVolume;
  const thcPerMlMax = totalTHCMax / oilVolume;

  const exportToText = () => {
    const content = `BHO THC Rechner\n\nBlütenmenge: ${cannabisWeight} g\nTHC-Gehalt der Blüten: ${thcPercent} % (Varianz: ${thcVarMin.toFixed(1)} % - ${thcVarMax.toFixed(1)} %)\nBHO-Ausbeute: ${bhoYieldPercent} %\nGeschätzter THC-Gehalt im BHO: ${estimatedBhoThcPurity.toFixed(2)} %\nÖlmenge: ${oilVolume} ml\n\nVerfügbares THC für Ölansatz (geschätzt): ${thcInBHO.toFixed(2)} g (bei 75% Effizienz)\nBHO-Menge: ${bhoAmount.toFixed(2)} g\nTHC pro ml Öl: ${thcPerMl.toFixed(2)} mg (Varianz: ${thcPerMlMin.toFixed(2)} - ${thcPerMlMax.toFixed(2)} mg/ml)\nTHC pro Tropfen: ${dosePerDrop.toFixed(2)} mg\nTHC pro 5 ml Dosis: ${dosePer5ml.toFixed(2)} mg`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "BHO-THC-Rechner.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gradient-to-b from-green-50 to-white rounded-xl shadow-md border border-green-200">
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="text-green-600" />
        <h2 className="text-2xl font-semibold text-green-700">BHO zu THC-Öl Rechner</h2>
      </div>

      <Card className="mb-6 bg-white/80 shadow-sm">
        <CardContent className="space-y-4 p-6">
          <div>
            <Label className="text-green-800">Blütenmenge (g)</Label>
            <Input type="number" value={cannabisWeight} onChange={e => setCannabisWeight(parseFloat(e.target.value))} />
          </div>

          <div>
            <Label className="text-green-800">THC-Gehalt der Blüten (%)</Label>
            <Input type="number" value={thcPercent} onChange={e => setThcPercent(parseFloat(e.target.value))} />
          </div>

          <div>
            <Label className="text-green-800">BHO-Ausbeute (%)</Label>
            <Input type="number" value={bhoYieldPercent} onChange={e => setBhoYieldPercent(parseFloat(e.target.value))} />
          </div>

          <div>
            <Label className="text-green-800">Ölmenge (ml)</Label>
            <Input type="number" value={oilVolume} onChange={e => setOilVolume(parseFloat(e.target.value))} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleUpdate} className="mt-4 bg-green-500 hover:bg-green-600 text-white">Berechnung aktualisieren</Button>
            <Button onClick={exportToText} className="mt-4 bg-green-600 hover:bg-green-700 text-white">Ergebnisse als Datei speichern</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50/50">
        <CardContent className="p-6 space-y-2">
          <h3 className="text-xl font-semibold text-green-700">Ergebnisse:</h3>
          <p><strong>Gesamtes THC in Blüten:</strong> {(totalTHC).toFixed(2)} g (vor Extraktion)</p>
          <p><strong>BHO-Menge:</strong> {bhoAmount.toFixed(2)} g</p>
          <p><strong>Verfügbares THC für Ölansatz (geschätzt):</strong> {thcInBHO.toFixed(2)} g (bei 75% Effizienz)</p>
          <p><strong>Geschätzter THC-Gehalt im BHO:</strong> {estimatedBhoThcPurity.toFixed(2)} %</p>
          <p><strong>THC-Gehalt pro ml Öl:</strong> {thcPerMl.toFixed(2)} mg (Varianz: {thcPerMlMin.toFixed(2)} - {thcPerMlMax.toFixed(2)} mg/ml)</p>
          <p><strong>THC-Gehalt pro Tropfen (ca. 0,05 ml):</strong> {dosePerDrop.toFixed(2)} mg</p>
          <p><strong>THC in 5 ml (z. B. Teelöffel):</strong> {dosePer5ml.toFixed(2)} mg</p>

          <div className="mt-4 p-3 border border-green-300 rounded-lg bg-green-100 text-green-800 text-sm flex items-start gap-2">
            <Info className="mt-0.5" size={18} />
            <span>
              Die Berechnung basiert auf folgenden Annahmen: 75 % Extraktionseffizienz, ±10 % Schwankung des THC-Gehalts laut Analysezertifikaten und Standardwerten für Tropfenmenge (20 Tropfen ≈ 1 ml). Alle Angaben sind Schätzungen.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

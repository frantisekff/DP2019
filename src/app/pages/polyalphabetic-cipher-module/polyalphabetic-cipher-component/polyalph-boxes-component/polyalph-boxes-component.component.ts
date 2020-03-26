import { Component, OnInit, Input } from "@angular/core";
import AnalysisText from "src/app/analysis-text";
import { LANGUAGEIC_DATA, COLORS } from "src/app/constants/language.constants";
import Utils from "src/app/utils";
import { PolyalphCipherService } from "../../polyalphabetic-cipher.service";

@Component({
  selector: "app-polyalph-boxes-component",
  templateUrl: "./polyalph-boxes-component.component.html",
  styleUrls: ["./polyalph-boxes-component.component.css"]
})
export class PolyalphBoxesComponentComponent implements OnInit {
  @Input() allBoxesAvgIc = [];
  @Input() ic;
  @Input() allBoxes;
  @Input() allBoxesIc: number[][] = [];

  selectedValue = '4';
  @Input() toggleOptions: string[] = [];

  private nearestLanguage: string;
  private maxSelectedValue = 17;
  passedMinIc = false;
  colors = COLORS;

  constructor(private polyalphCipherService: PolyalphCipherService) {
    this.polyalphCipherService.selectedValue.subscribe(newSelectedValue => {
      console.log(newSelectedValue);
      this.selectedValue = newSelectedValue.toString();
    });
  }

  ngOnInit() {
    // generate array <2-16>
    this.toggleOptions = Utils.createArrayOfLength(
      this.maxSelectedValue - 2,
      2
    );

    this.ic = this.allBoxesAvgIc[+this.selectedValue - 2];
  }

  // Change data for updateFlagCompareFreq based of selection <1-26>
  public selectionOfGraphChanged(item) {
    this.ic = this.allBoxesAvgIc[item.value - 2];
    console.log("All Boxes Avg IC: ", this.allBoxesAvgIc);

    this.nearestLanguage = AnalysisText.findNearestLanguage(
      this.ic,
      LANGUAGEIC_DATA
    );
    if (this.nearestLanguage === "Min IC") {
      this.passedMinIc = true;
    }
    console.log("Selected value: " + item.value);
  }
}

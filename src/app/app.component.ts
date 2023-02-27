import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'number-rebaser';

	bases: BaseResultModel[] = [];
	workers: Worker[] = [];

	displayChastizingText: boolean = false;

	userInput: any = 0;
	userInputUpdate = new Subject<any>();

	lastDetectedInput: any;

  constructor() {
		this.userInputUpdate.pipe(
			tap(val => {
				this.displayChastizingText = false;
				if (val > 9007199254740992 || val < 0) {
					this.displayChastizingText = true;
				}
			}),
			debounceTime(400),
			distinctUntilChanged(),
		).pipe(
			tap(val => {
				if (val == this.lastDetectedInput) {
					return;
				}
				if (this.displayChastizingText) {
					return;
				}

				let bases = this.bases;
				this.bases = [];
				for (let i = 2; i < 27; i++) {
					this.bases.push({
						description: "base " + i,
						value: bases[i - 2].value
					})
				}
				this.lastDetectedInput = val;
			}),
		).subscribe(value => {
			if (this.displayChastizingText) {
				return;
			}

			for (let i = 2; i < 27; i++) {
				this.runWorker(i, {
					numberToTransform: value,
					baseOfNumberToTransform: 10,
					desiredOutputBase: i
				});
			}
		})
	}

  ngOnInit(): void {
		for (let i = 2; i < 27; i++) {
			this.bases.push({
				description: "base " + i,
				value: "0"
			})
		}

		for (let i = 0; i < 27; i++) {
			const worker = new Worker(new URL('./app.worker', import.meta.url));
			worker.onmessage = event => {
				this.bases[event.data.outputBase - 2].value = event.data.output;
			}
			this.workers.push(worker)
		}
  }

	runWorker(index: number, args: any) {
		this.workers[index].postMessage(args);
	}
}

class BaseResultModel {
	description: string;
	value: string;
}

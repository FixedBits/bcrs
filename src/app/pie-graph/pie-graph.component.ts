/**
 * Title: Pie Chart
 * Author: Professor Krasso
 * Updated by: Victor Soto
 * Date: 07/19/2024
 * Source> https://www.chartjs.org/
 */

import { Component, OnInit } from '@angular/core';
import { Chart, registerables, ChartConfiguration } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-pie',
  templateUrl: './pie-graph.component.html',
  styleUrls: ['./pie-graph.component.css']
})
export class PieGraphComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    // Create a new pie chart instance via the myPie variable and the Chart constructor.
    // Pass in the id of the canvas element and the type of chart (pie).
    // Pass in the data and options objects to the chart constructor.
    const myPie = new Chart("myPieChart", {
      type: 'pie',
      data: {
        labels: ['Password Reset', 'Spyware Removal', 'RAM Upgrade', 'Software Installation', 'PC Tune-up', 'Keyboard Cleaning', 'Disk Clean-up'], // Labels for the data
        datasets: [{
          data: [6, 5, 2, 3, 2, 2, 2], // Data for the dataset
          backgroundColor: [
            '#ED0A3F',
            '#FF8833',
            '#5FA777',
            '#0066CC',
            '#6B3FA0',
            '#AF593E',
            '#6CDAE7'
          ],
          hoverBackgroundColor: [
            '#ED0A3F',
            '#FF8833',
            '#5FA777',
            '#0066CC',
            '#6B3FA0',
            '#AF593E',
            '#6CDAE7'
          ],
        }]
      },
      options: {
      maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 18
              }
            }
          }
        }
      }
    })
  }
}

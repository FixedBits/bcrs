/**
 * DeVonte' Ellis
 * 7-11-24
 * FAQ page logic and functionality
 */

import { Component, OnInit } from '@angular/core';;

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})

export class FaqComponent implements OnInit {
  constructor() {}
//Adds the required functionality for opening the faq panels
  ngOnInit(): void {
    const faqs = document.querySelectorAll(".faq");

faqs.forEach(faq => {
    faq.addEventListener("click", () => {
        faq.classList.toggle("active")
    })
})
  }
}




import {screen} from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import {setLocalStorage} from "../../setup-jest"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills"
import BillsUI from "../views/BillsUI.js"

// Setup
const onNavigate = () => {return}
setLocalStorage('Employee')

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    describe("and there are Bills", () => {
      test("Then bills should be ordered from earliest to latest", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
        expect(dates).toEqual([...dates].sort((a, b) => ((a < b) ? 1 : -1)))
      })
    })
    describe("But it is loading", () => {
      test("Then, Loading page should be rendered", () => {
        document.body.innerHTML = BillsUI({ loading: true })
        expect(screen.getAllByText("Loading...")).toBeTruthy()
      })
    })
    describe("But an error occure", () => {
      test("Then, Error page should be rendered", () => {
        document.body.innerHTML = BillsUI({ error: "oops an error" })
        expect(screen.getAllByText("Erreur")).toBeTruthy()
      })
    })
    describe("And I click on the new bill button", () => {
      test("Then the click new bill handler should be called", () => {  
        document.body.innerHTML = BillsUI({ data: bills })
        const sampleBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
        sampleBills.handleClickNewBill = jest.fn()
        screen.getByTestId("btn-new-bill").addEventListener("click", sampleBills.handleClickNewBill)
        screen.getByTestId("btn-new-bill").click()
        expect(sampleBills.handleClickNewBill).toBeCalled()
      })
    })
    describe("And I click on the eye icon", () => {
      test("A modal should open", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const sampleBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
        sampleBills.handleClickIconEye = jest.fn()
        screen.getAllByTestId("icon-eye")[0].click()
        expect(sampleBills.handleClickIconEye).toBeCalled()
      })
      test("Then the modal should display the attached image", () => {
        document.body.innerHTML = BillsUI({ data: bills })
        const sampleBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
        const iconEye = document.querySelector(`div[data-testid="icon-eye"]`)
        $.fn.modal = jest.fn()
        sampleBills.handleClickIconEye(iconEye)
        expect($.fn.modal).toBeCalled()
        expect(document.querySelector(".modal")).toBeTruthy()
      })
    })
  })
})
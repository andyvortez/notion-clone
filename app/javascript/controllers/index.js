import { application } from "app/javascript/controllers/application"
import EditableCellController from "app/javascript/controllers/editable_cell_controller"
import ModalController from "app/javascript/controllers/modal_controller"

application.register("editable-cell", EditableCellController)
application.register("modal", ModalController)
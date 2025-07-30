import { application } from "controllers/application"
import EditableCellController from "./editable_cell_controller"
import ModalController from "./modal_controller"

application.register("editable-cell", EditableCellController)
application.register("modal", ModalController)
import React from "react";
import Modal from "react-modal";

interface UserModalsProps {
    userToEdit: { id: number; name: string; dogName: string, phoneNumber: string } | null;
    isEditModalOpen: boolean;
    isDeleteModalOpen: boolean;
    closeEditModal: () => void;
    closeDeleteModal: () => void;
    onEditConfirm: (userId: number, newName: string, newDogName: string, newPhoneNumber: string) => void;
    onDeleteConfirm: (userId: number) => void;
}

const UserModals: React.FC<UserModalsProps> = ({
    isEditModalOpen,
    isDeleteModalOpen,
    closeEditModal,
    closeDeleteModal,
    userToEdit,
    onEditConfirm,
    onDeleteConfirm,
}) => {
    const [newName, setNewName] = React.useState(userToEdit?.name || "");
    const [newDogName, setNewDogName] = React.useState(userToEdit?.dogName || "");
    const [newPhoneNumber, setNewPhoneNumber] = React.useState(userToEdit?.phoneNumber || "");
    const [isDataReady, setIsDataReady] = React.useState(false); // Флаг для проверки, что данные готовы

    // Обновляем данные при изменении userToEdit
    React.useEffect(() => {
        if (userToEdit) {
            setNewName(userToEdit.name);
            setNewDogName(userToEdit.dogName);
            setNewPhoneNumber(userToEdit.phoneNumber);
            setIsDataReady(true); // Устанавливаем флаг в true, когда данные обновлены
        }
    }, [userToEdit]);

    const handleEditConfirm = () => {
        if (userToEdit && isDataReady) { // Проверяем, что данные обновлены
            onEditConfirm(userToEdit.id, newName, newDogName, newPhoneNumber);
            closeEditModal();
        }
    };

    return (
        <>
            {/* Modal for Editing */}
            {/* @ts-ignore */}
            <Modal
                isOpen={isEditModalOpen}
                onRequestClose={closeEditModal}
                contentLabel="Редактировать пользователя"
                ariaHideApp={false}
                className="custom-modal"
                overlayClassName="custom-modal-overlay"
            >
                <form className="admin-form">
                    <h2>Редактировать пользователя</h2>
                    <label>
                        Имя:
                        <input
                            type="text"
                            className="admin-date-input"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                    </label>
                    <label>
                        Имя собаки:
                        <input
                            type="text"
                            className="admin-date-input"
                            value={newDogName}
                            onChange={(e) => setNewDogName(e.target.value)}
                        />
                    </label>
                    <label>
                        Номер телефона:
                        <input
                            type="text"
                            className="admin-date-input"
                            value={newPhoneNumber}
                            onChange={(e) => setNewPhoneNumber(e.target.value)}
                        />
                    </label>
                    <div className="modal-buttons">
                        <button
                            className="default-btn save reverse"
                            onClick={() => {
                                handleEditConfirm()
                            }}
                        >
                            Сохранить
                        </button>
                        <button className="default-btn cancel" onClick={closeEditModal}>
                            Отмена
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal for Deleting */}
            {/* @ts-ignore */}
            <Modal
                isOpen={isDeleteModalOpen}
                onRequestClose={closeDeleteModal}
                contentLabel="Удалить пользователя"
                ariaHideApp={false}
                className="custom-modal"
                overlayClassName="custom-modal-overlay"
            >
                <form className="admin-form">
                    <h2>Вы уверены, что хотите удалить пользователя?</h2>
                    <div className="modal-buttons">
                        <button
                            className="default-btn delete-confirm"
                            type="button"
                            onClick={() => {
                                if (userToEdit) {
                                    onDeleteConfirm(userToEdit.id);
                                    closeDeleteModal();
                                }
                            }}
                        >
                            Удалить
                        </button>
                        <button className="default-btn cancel reverse" onClick={closeDeleteModal}>
                            Отмена
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default UserModals;

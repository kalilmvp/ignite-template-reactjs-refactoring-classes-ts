import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export interface FoodData {
    id: number;
    name: string;
    price: string;
    description: string;
    image: string;
}

const Dashboard = (): JSX.Element => {
    const [ modalOpen, setModalOpen ] = useState(false);
    const [ editModalOpen, setEditModalOpen ] = useState(false);
    const [ editingFood, setEditingFood ] = useState<FoodData>({} as FoodData);
    const [ foods, setFoods ] = useState<FoodData[]>([]);

    useEffect(() => {
        async function loadFoods() {
            const response = await api.get('/foods');

            setFoods(response.data);
        }
        loadFoods();
    }, []);

    async function handleAddFood(food: FoodData) {
        try {
            const response = await api.post('/foods', {
                ...food,
                available: true,
            });

            setFoods([ ...foods, response.data ]);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpdateFood(food: FoodData) {
        try {
            const foodUpdated = await api.put(`/foods/${ editingFood.id }`, { ...editingFood, ...food },
            );

            setFoods(foods.map(f => f.id !== foodUpdated.data.id ? f : foodUpdated.data));
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDeleteFood(id: number) {
        await api.delete(`/foods/${ id }`);

        setFoods(foods.filter(food => food.id !== id))
    }

    function toggleModal() {
        setModalOpen(!modalOpen);
    }

    function toggleEditModal() {
        setEditModalOpen(!editModalOpen);
    }

    function handleEditFood(food: FoodData) {
        setEditingFood(food);
        setEditModalOpen(true);
    }

    return (
        <>
            <Header openModal={ toggleModal }/>
            <ModalAddFood
                isOpen={ modalOpen }
                setIsOpen={ toggleModal }
                handleAddFood={ handleAddFood }
            />
            <ModalEditFood
                isOpen={ editModalOpen }
                setIsOpen={ toggleEditModal }
                editingFood={ editingFood }
                handleUpdateFood={ handleUpdateFood }
            />

            <FoodsContainer data-testid="foods-list">
                { foods &&
                foods.map(food => (
                    <Food
                        key={ food.id }
                        food={ food }
                        handleDelete={ handleDeleteFood }
                        handleEditFood={ handleEditFood }
                    />
                )) }
            </FoodsContainer>
        </>
    );
};

export default Dashboard;
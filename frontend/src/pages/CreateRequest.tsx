import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ShimmerButton } from '../components/ui/shimmer-button';
import { createRequest } from '../../api/Requests';
import { getAllSkills } from '../../api/Constant';


const RequestSchema = z.object({
    offered_skills: z.array(z.number()).nonempty('Please select at least one offered skill.'),
    wanted_skills: z.array(z.number()).nonempty('Please select at least one wanted skill.'),
    message: z.string().min(10, 'Message must be at least 10 characters.')
});

type RequestFormData = z.infer<typeof RequestSchema>;


const CreateRequestForm: React.FC = () => {
    const [skills, setSkills] = useState<{ id: number; name: string }[]>([]);
    const [, setLoadingSkills] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<RequestFormData>({
        resolver: zodResolver(RequestSchema),
    });

    useEffect(() => {
        const fetchSkills = async () => {
            setLoadingSkills(true);
            try {
                const skillsData = await getAllSkills();
                setSkills(skillsData);
            } catch (error) {
                console.error('Failed to load skills:', error);
            } finally {
                setLoadingSkills(false);
            }
        };

        fetchSkills();
    }, []);

    const onSubmit = async (data: RequestFormData) => {
        try {
            await createRequest({
                user_id: 1,
                offered_skills: data.offered_skills,
                wanted_skills: data.wanted_skills,
                message: data.message
            });

            alert('Request created successfully!');
            reset();

        } catch (error) {
            console.error('Error creating request:', error);
            alert('Error creating request. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center bg-orange px-3 py-10 min-h-screen font-inter">
            <div className="z-50 space-y-8 bg-white shadow-md p-8 rounded w-full sm:w-[500px]">
                <h2 className="font-grotesk font-bold text-black text-2xl text-center">
                    Create a New Request
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Offered Skills */}
                    <div>
                        <label className="block font-medium text-gray-700 text-sm">
                            Offered Skills
                        </label>
                        <select
                            multiple
                            {...register('offered_skills', { valueAsNumber: true })}
                            className="bg-gray-100 mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-black sm:text-sm"
                        >
                            {skills.map((skill) => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </option>
                            ))}
                        </select>
                        {errors.offered_skills && (
                            <p className="mt-1 text-red-500 text-sm">
                                {errors.offered_skills.message}
                            </p>
                        )}
                    </div>

                    {/* Wanted Skills */}
                    <div>
                        <label className="block font-medium text-gray-700 text-sm">
                            Wanted Skills
                        </label>
                        <select
                            multiple
                            {...register('wanted_skills', { valueAsNumber: true })}
                            className="bg-gray-100 mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-black sm:text-sm"
                        >
                            {skills.map((skill) => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </option>
                            ))}
                        </select>
                        {errors.wanted_skills && (
                            <p className="mt-1 text-red-500 text-sm">
                                {errors.wanted_skills.message}
                            </p>
                        )}
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block font-medium text-gray-700 text-sm">
                            Message
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Describe your request..."
                            {...register('message')}
                            className="bg-gray-100 mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-black sm:text-sm"
                        />
                        {errors.message && (
                            <p className="mt-1 text-red-500 text-sm">
                                {errors.message.message}
                            </p>
                        )}
                    </div>

                    <div className="content-center grid">
                        <button type="submit" disabled={isSubmitting}>
                            <ShimmerButton>
                                {isSubmitting ? 'Creating...' : 'Create Request'}
                            </ShimmerButton>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRequestForm;
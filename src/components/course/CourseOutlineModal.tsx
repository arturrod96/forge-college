import { useIsMobile } from '@/hooks/use-mobile';
import { Course, Lesson } from '@/pages/CourseView';
import { CourseTableOfContents } from '@/components/dashboard/CourseTableOfContents';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { BookOpen } from 'lucide-react';

interface CourseOutlineModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: Course;
    currentLessonId?: string;
    defaultOpenModuleId?: string;
    onLessonClick: (lesson: Lesson) => void;
}

export function CourseOutlineModal({
    open,
    onOpenChange,
    course,
    currentLessonId,
    defaultOpenModuleId,
    onLessonClick,
}: CourseOutlineModalProps) {
    const isMobile = useIsMobile();

    const handleLessonClick = (lesson: Lesson) => {
        onLessonClick(lesson);
        onOpenChange(false);
    };

    const content = (
        <div className="max-h-[60vh] overflow-y-auto">
            <CourseTableOfContents
                course={course}
                currentLessonId={currentLessonId}
                defaultOpenModuleId={defaultOpenModuleId}
                onLessonClick={handleLessonClick}
            />
        </div>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader className="border-b">
                        <DrawerTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-forge-orange" />
                            {course.title}
                        </DrawerTitle>
                    </DrawerHeader>
                    {content}
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 gap-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-forge-orange" />
                        {course.title}
                    </DialogTitle>
                </DialogHeader>
                {content}
            </DialogContent>
        </Dialog>
    );
}

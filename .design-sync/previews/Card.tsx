import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction, Button, Badge } from 'web';
export const Basic = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Calculus II</CardTitle>
      <CardDescription>Integrals & series</CardDescription>
      <CardAction><Badge variant="secondary">In progress</Badge></CardAction>
    </CardHeader>
    <CardContent className="text-muted-foreground text-sm">
      12 of 18 lessons complete. Keep a 30-minute focus block to stay on track.
    </CardContent>
    <CardFooter className="gap-2">
      <Button size="sm">Resume</Button>
      <Button size="sm" variant="outline">Details</Button>
    </CardFooter>
  </Card>
);

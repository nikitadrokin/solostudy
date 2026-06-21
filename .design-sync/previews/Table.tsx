import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from 'web';
import { Badge } from 'web';
const rows = [
  ['Calculus II', '12/18', 'In progress'],
  ['Linear Algebra', '18/18', 'Complete'],
  ['Organic Chemistry', '4/20', 'In progress'],
];
export const Sessions = () => (
  <div className="w-[32rem]">
    <Table>
      <TableCaption>Your courses this term.</TableCaption>
      <TableHeader>
        <TableRow><TableHead>Course</TableHead><TableHead>Lessons</TableHead><TableHead>Status</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r[0]}>
            <TableCell className="font-medium">{r[0]}</TableCell>
            <TableCell>{r[1]}</TableCell>
            <TableCell><Badge variant={r[2] === 'Complete' ? 'secondary' : 'default'}>{r[2]}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

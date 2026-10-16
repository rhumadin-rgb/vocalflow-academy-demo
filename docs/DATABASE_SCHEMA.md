# 데이터베이스 구조 (Supabase / PostgreSQL)

실제 운영용 공유 데이터베이스의 초기 구조입니다. 적용 SQL은 [초기 마이그레이션](../supabase/migrations/202610160001_initial_schema.sql)입니다. 모든 학원 데이터에는 `academy_id`가 있어 학원 간 데이터가 섞이지 않도록 하고, Supabase Auth 사용자 ID를 역할 정보와 연결합니다.

## 테이블 관계 요약

```text
auth.users ─ profiles
     └──── academy_members ─ academies ─ academy_settings
                                  ├─ student_levels
                                  ├─ teachers ─ teacher_pay_rates
                                  │     ├──── teacher_room_assignments ─ rooms
                                  │     └──── payroll_adjustments
                                  ├─ students ─ student_pass_ledger
                                  │     ├──── invoices ─ payment_allocations ─ payments
                                  │     └──── lessons ─ lesson_feedback
                                  ├─ lessons ─ rooms
                                  ├─ room_bookings ─ rooms
                                  ├─ financial_transactions
                                  ├─ recurring_transaction_templates
                                  └─ notification_logs
```

## 테이블 역할

| 테이블 | 용도 |
| --- | --- |
| `academies`, `academy_members`, `profiles` | 학원, 사용자 계정, 원장·관리자·강사·원생 역할 |
| `student_levels`, `students`, `teachers`, `rooms` | 반별 예약 한도, 원생·보호자, 강사, 공간 |
| `lessons`, `lesson_feedback` | 1:1 수업 일정·출결과 수업 코멘트·보완점·연습 과제 |
| `student_pass_ledger` | 수강권 충전·출석 차감·환불·관리자 조정 이력 |
| `invoices`, `payments`, `payment_allocations` | 청구, 실제 수납, 부분 수납의 청구서 배분 |
| `room_bookings`, `teacher_room_assignments`, `academy_settings` | 연습실 예약, 강사 고정 레슨실, 노쇼 제한 |
| `teacher_pay_rates`, `payroll_adjustments` | 기간별 회당 급여와 원장 조정액 |
| `financial_transactions`, `recurring_transaction_templates` | 수입·지출 내역과 매월 반복할 템플릿 |
| `notification_logs` | 알림톡 발송 요청·성공·실패 내역 |

## 자동 계산과 제약

- `student_pass_balances` 뷰가 원생별 잔여 레슨을 수강권 원장 합계로 계산합니다. 출석 상태가 `attended`로 바뀌면 DB 트리거가 1회를 차감하고, 출석을 취소하면 환불 기록을 남깁니다.
- `invoice_balances` 뷰가 청구 금액, 배분된 수납액, 미납액 및 납부 상태를 계산합니다. 부분 수납을 지원하며 청구 금액 또는 실제 수납액을 초과해 배분할 수 없습니다.
- `teacher_monthly_payroll` 뷰가 출석된 수업과 수업 날짜에 유효한 회당 급여, 조정액을 합산합니다. 급여 단가는 `teacher_pay_rates`에 적용 시작일과 종료일을 두어 이력으로 관리합니다.
- 동일 공간·강사·원생의 겹치는 레슨 일정은 제외 제약으로 차단합니다. 연습실 예약과 레슨 일정 간 공간 충돌도 트리거가 확인합니다.
- 원생의 일일 예약 시간 한도는 `student_levels.daily_room_limit_minutes`, 노쇼 제한은 `academy_settings.no_show_limit`으로 관리합니다.
- 강사 고정 배정 시간의 공간은 연습실 예약이 침범하지 못합니다.
- `get_room_availability` RPC는 학원 구성원에게 공간·시간만 반환하며 예약자 이름이나 학생 ID를 노출하지 않습니다.
- 테이블별 RLS와 학원 멤버 역할 검사를 적용했습니다. 원생은 본인 수업·피드백만, 강사는 본인 담당 수업과 급여만 읽을 수 있도록 구성했습니다. `create_academy` RPC는 로그인된 사용자를 새 학원의 원장으로 등록합니다.

## Supabase 적용 순서

1. Supabase에서 **새 프로젝트**를 만들고 프로젝트 백업/복구 옵션을 확인합니다.
2. SQL Editor에서 마이그레이션 파일 전체를 실행하거나 Supabase CLI 프로젝트에 파일을 둔 뒤 `supabase db push`를 실행합니다. 기존 운영 DB에는 바로 적용하지 말고 먼저 별도 개발 프로젝트에서 검증합니다.
3. Auth에 원장 계정을 가입시킵니다. 앱에서 로그인한 뒤 다음 RPC를 호출해 학원을 생성합니다.

   ```js
   const { data: academyId, error } = await supabase.rpc("create_academy", {
     _name: "보이스온 실용음악학원",
     _display_name: "김보이스"
   });
   if (error) throw error;
   ```

4. 반환된 `academyId`로 `student_levels`와 `rooms`를 등록합니다. 예를 들어 입시반은 일일 예약 4시간(240분), 취미반은 2시간(120분)으로 등록합니다.
5. 원장 계정으로 `teachers`, `students`를 등록합니다. 로그인 계정이 있는 강사·원생은 해당 Auth 사용자 UUID를 각 행의 `user_id`와 `academy_members.user_id`에 연결하고, `academy_members.role`도 실제 역할에 맞춰 지정해야 합니다. 단순히 `user_id`만 연결해서는 권한이 부여되지 않습니다.
6. 출결 전에 `teacher_pay_rates`의 적용 단가와 원생별 초기 수강권 충전(`student_pass_ledger`, `entry_kind='grant'`)을 등록합니다.
7. 테스트 계정을 원장·관리자·강사·원생 역할별로 만들고, RLS를 켠 상태에서 다른 학원의 ID를 조회하거나 다른 원생의 수업·피드백·청구 정보를 읽을 수 없는지 확인합니다.

초기 반과 공간 데이터는 원장 세션에서 아래처럼 등록할 수 있습니다. `<academy-uuid>`는 RPC에서 반환된 실제 UUID로 바꿉니다.

```sql
insert into public.student_levels (academy_id, name, daily_room_limit_minutes)
values
  ('<academy-uuid>', '입시반', 240),
  ('<academy-uuid>', '취미반', 120);

insert into public.rooms (academy_id, name, room_type)
values
  ('<academy-uuid>', '연습실 1', 'practice'),
  ('<academy-uuid>', '연습실 2', 'practice'),
  ('<academy-uuid>', '레슨실 A', 'lesson'),
  ('<academy-uuid>', '레슨실 B', 'lesson');
```

## 앱 연동 전 확인할 점

이 파일은 스키마와 DB 제약의 시작점이며, 현재 정적 데모 앱의 `localStorage`를 자동으로 마이그레이션하거나 Supabase에 연결하지 않습니다. DB 마이그레이션과 별도로 앱에서 조회·저장 코드를 Supabase API/RPC로 전환해야 합니다.

수납 등록은 청구서, 결제, 배분, 수강권 충전, 회계 내역을 한 번에 기록해야 하므로 여러 브라우저 API 호출로 분리하지 말고 검증된 Postgres RPC/서버 함수에서 하나의 트랜잭션으로 처리하세요. 정기 회계 템플릿도 Supabase Cron 또는 서버 스케줄러에서 실제 거래 행으로 생성해야 합니다. 알림톡은 서버 측 공급자 연동 후 발송 로그를 기록합니다.

`service_role` 키는 RLS를 우회하므로 브라우저 코드나 Git 저장소에 넣으면 안 됩니다. 환경 변수에 보관하고 서버/Edge Function에서만 사용하세요. 실제 배포 전에는 정책을 테스트 프로젝트에서 검증하고 개인정보 보관·삭제 및 백업 정책을 정하세요.

// Intersection Observer를 사용하여 스크롤 시 페이드인 애니메이션 구현
document.addEventListener("DOMContentLoaded", () => {
    // 애니메이션 적용할 요소들 선택
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null,          // 뷰포트 기준
        rootMargin: '0px',
        threshold: 0.15      // 타겟 요소가 15% 보일 때 트리거
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 부드럽게 나타나는 효과 적용
                entry.target.classList.add('is-visible');
                // 한번 나타난 요소는 다시 감시하지 않음 (선택사항)
                // observer.unobserve(entry.target); 
            } else {
                // 만약 위아래로 스크롤할때마다 다시 효과를 보고 싶다면 추가,
                // 하지만 설문의 집중도를 해치지 않으려면 나타난 채로 두는 것이 좋을 때도 있음.
                // 여기서는 스크롤 아웃시 다시 효과를 내기 위해 클래스 제거
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 폼 제출을 가로채어 제출 성공 메시지로 부드럽게 전환(AJAX)
    const form = document.getElementById('survey-form');
    const successMessage = document.getElementById('success-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // 기본 이동 방지
            
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>전송 중...</span>';
            submitBtn.disabled = true;

            const formData = new FormData(form);

            fetch('https://formsubmit.co/ajax/oddugi02@gmail.com', {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // 부드러운 전환 효과를 위해 opacity 조절
                form.style.transition = 'opacity 0.4s ease';
                form.style.opacity = '0';
                
                setTimeout(() => {
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // 애니메이션 준비
                    successMessage.style.opacity = '0';
                    successMessage.style.transform = 'translateY(30px)';
                    successMessage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                    
                    // 리렌더링 강제 (리플로우)
                    void successMessage.offsetWidth; 
                    
                    // 성공 메시지 나타남
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                    
                    // 화면 최상단으로 스크롤 이동
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 400);
            })
            .catch(error => {
                console.error('Submission Error:', error);
                alert('제출 중 오류가 발생했습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.');
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // 라디오 버튼 선택 시 키보드 접근성 처리(엔터로 선택)
    const radioLabels = document.querySelectorAll('.radio-label');
    radioLabels.forEach(label => {
        label.setAttribute('tabindex', '0');
        label.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const input = label.querySelector('input[type="radio"]');
                if (input) {
                    input.checked = true;
                    // change 이벤트 수동 발생
                    const event = new Event('change');
                    input.dispatchEvent(event);
                }
            }
        });
    });
});

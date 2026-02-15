<?php

namespace App\Console\Commands;

use App\Models\Visit;
use Illuminate\Console\Command;

class UpdateVisitsToPending extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'visits:update-to-pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update existing visits with status "in" to "pending" if they haven\'t checked out';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating visits to pending status...');

        // Update visits yang status 'in' dan belum check-out
        $updated = Visit::where('status', 'in')
            ->whereNull('check_out_at')
            ->update([
                'status' => 'pending',
                'check_in_at' => null,
            ]);

        $this->info("Updated {$updated} visit(s) to pending status.");
        
        // Show current stats
        $this->newLine();
        $this->info('Current visits statistics:');
        $this->table(
            ['Status', 'Count'],
            [
                ['Pending', Visit::where('status', 'pending')->count()],
                ['In', Visit::where('status', 'in')->count()],
                ['Out', Visit::where('status', 'out')->count()],
            ]
        );

        return Command::SUCCESS;
    }
}

